import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "../domain/order-item.entity";
import Order from "../domain/order.entity";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

const clientId = "123";

const prod1 = new OrderItem({
  id: new Id("ABC"),
  name: "iPhone",
  description: "Very good phone",
  salesPrice: 6000.00,
  productId: "1",
});

const prod2 = new OrderItem({
  id: new Id("ABCD"),
  name: "iPad",
  description: "Very good tablet",
  salesPrice: 10000.00,
  productId: "2",
});

const products = [prod1, prod2];

describe("Order repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderItemModel, OrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const orderRepository = new OrderRepository();

    const order = new Order({
      clientId: clientId,
      products: products,
      invoiceId: "1",
    });

    await orderRepository.addOrder(order);

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: ["products"],
      rejectOnEmpty: true,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(order.id.id);
    expect(result.clientId).toBe(order.clientId);
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
