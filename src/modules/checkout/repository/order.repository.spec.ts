import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import ClientOrderModel from "./client.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import ProductOrderModel from "./product.model";

describe("Order repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderModel, ClientOrderModel, ProductOrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const order = createOrder();

    const orderRepository = new OrderRepository();
    await orderRepository.addOrder(order);

    const result = await OrderModel.findOne({
      where: { id: "1" },
      include: [
        { model: ClientOrderModel },
        { model: ProductOrderModel }
      ]
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(order.id.id);
    expect(result.client_id).toBe(order.client.id.id);
    expect(result.client.name).toBe(order.client.name);
    expect(result.client.email).toBe(order.client.email);
    expect(result.client.address).toBe(order.client.address);
    expect(result.invoiceId).toBe(order.invoiceId);

    expect(result.products.length).toBe(2);
    expect(result.products[0].name).toBe(order.products[0].name);
    expect(result.products[0].description).toBe(order.products[0].description);
    expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
    expect(result.products[1].name).toBe(order.products[1].name);
    expect(result.products[1].description).toBe(order.products[1].description);
    expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);
  });

});

function createOrder() {
  const client = new Client({
    id: new Id("1"),
    name: "John Doe",
    email: "john.doe@email.com",
    address: "Main Street, CA, 123",
  });

  const product1 = new Product({
    name: "Product 1",
    salesPrice: 100,
    description: "Description 1",
  });

  const product2 = new Product({
    name: "Product 2",
    salesPrice: 200,
    description: "Description 2",
  });

  const order = new Order({
    id: new Id("1"),
    client: client,
    products: [product1, product2],
    invoiceId: "anyInvoiceId",
  });

  order.approved();
  return order;
}

