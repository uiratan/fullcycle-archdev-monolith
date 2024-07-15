import Client from "../../client-adm/domain/client.entity";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientOrderModel } from "./client.model";
import { OrderModel } from "./order.model";
import ProductOrderModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create({
      id: order.id.id,
      client: {
        id: order.client.id.id,
        name: order.client.name,
        email: order.client.email,
        address: order.client.address,
        createdAt: order.client.createdAt,
        updatedAt: order.client.updatedAt
      },
      products: order.products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })
      ),
      invoiceId: order.invoiceId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    },
      { include: [ClientOrderModel, ProductOrderModel] }
    );
  }

  findOrder(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }

}