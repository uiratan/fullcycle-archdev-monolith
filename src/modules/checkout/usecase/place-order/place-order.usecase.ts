import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface, { CheckStockFacadeOutputDto } from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Order from "../../domain/order.entity";
import OrderItem from "../../domain/order-item.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUsecase implements UseCaseInterface {

  private _repository: CheckoutGateway;
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    repository: CheckoutGateway,
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._repository = repository;
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    const clientId = client.id;
    const order = new Order({
      clientId: clientId,
      products: products
    });


    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    let invoice = null;
    if (payment.status === "approved") {
      invoice = await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: products.map((p) => {
          return {
            id: p.id.id,
            name: p.name,
            price: p.salesPrice,
          };
        }),
      });

      order.invoiceId = invoice.id;
    }

    payment.status === "approved" && order.approved();

    await this._repository.addOrder(order);

    const result = {
      id: order.id.id,
      clientId,
      invoiceId: payment.status === "approved" ? order.invoiceId : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
    return result;  
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (isProductListEmpty(input)) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({ productId: p.productId });
      checkProductStock(product);
    }
  }

  private async getProduct(productId: string): Promise<OrderItem> {
    const product = await this._catalogFacade.find({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      productId: product.id,
    };

    return new OrderItem(productProps);
  }
}

function isProductListEmpty(input: PlaceOrderInputDto) {
  return input.products.length === 0;
}

function checkProductStock(product: CheckStockFacadeOutputDto) {
  if (product.stock <= 0) {
    throw new Error(
      `Product ${product.productId} is not available in stock`
    );
  }
}

