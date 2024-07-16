import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import AdmProductModel from "../../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../db-migrations/config/migrator";
import { app } from "../express";


let sequelize: Sequelize;
let migration: Umzug<any>;

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      ClientModel,
      AdmProductModel,
      StoreCatalogProductModel,
      OrderModel,
      OrderItemModel,
      InvoiceModel,
      InvoiceItemModel,
      TransactionModel
    ]);

    migration = migrator(sequelize)
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should place an order", async () => {

    const clientFacade = ClientAdmFacadeFactory.create();
    const clientFacadeInputDto = {
      id: "1",
      name: "name 1",
      email: "email@email.com",
      document: "123",
      address: {
        street: "address 1",
        number: "number1",
        complement: "complement1",
        city: "city1",
        state: "state1",
        zipCode: "0000000",
      },
    };
    await clientFacade.add(clientFacadeInputDto);

    const productAdminFacade = ProductAdmFacadeFactory.create();
    const productFacadeInputDto1 = {
      id: "1",
      name: "product1",
      description: "description1",
      purchasePrice: 120,
      stock: 40,
    };
    const productFacadeInputDto2 = {
      id: "2",
      name: "product2",
      description: "description2",
      purchasePrice: 80,
      stock: 100,
    };
    const p1 = await productAdminFacade.addProduct(productFacadeInputDto1);
    const p2 = await productAdminFacade.addProduct(productFacadeInputDto2);

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: clientFacadeInputDto.id,
        products: [
          {
            productId: productFacadeInputDto1.id
          },
          {
            productId: productFacadeInputDto2.id
          }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();   
    expect(response.body.clientId).toBe(clientFacadeInputDto.id);
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(240);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].productId).toBe(productFacadeInputDto1.id);
    expect(response.body.products[1].productId).toBe(productFacadeInputDto2.id);

  });
});
