import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const result = await OrderModel.create({
      id: order.id.id,
      clientId: order.clientId,
      products: order.products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        productId: product.productId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      invoiceId: order.invoiceId,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    },
      { include: [ OrderItemModel] }
    );    
  }

  findOrder(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }

}