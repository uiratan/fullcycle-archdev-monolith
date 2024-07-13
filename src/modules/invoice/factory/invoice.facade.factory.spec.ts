import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "./invoice.facade.factory";

describe("Invoice Facade factory unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {    
    const facade = InvoiceFacadeFactory.create();
    const input = {
      name: "invoice name",
      document: "invoice document",
      street: "invoice street",
      number: "100",
      complement: "invoice complement",
      city: "invoice city",
      state: "invoice state",
      zipCode: "invoice zipCode",
      items: [
        {
          id: "1",
          name: "invoice item name",
          price: 10
        },
        {
          id: "2",
          name: "invoice item name 2",
          price: 20
        }
      ]
    };

    const invoice = await facade.generate(input);
    
    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
    expect(invoice.items.length).toBe(2);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
    expect(invoice.total).toBe(30);
  });

  
  it("should find an invoice", async () => {
    const invoiceCreated = await InvoiceModel.create({
      id: "1",
      name: "invoice name",
      document: "invoice document",
      street: "invoice street",
      number: "100",
      complement: "invoice complement",
      city: "invoice city",
      state: "invoice state",
      zipCode: "invoice zipCode",
      items: [
        {
          id: "1",
          name: "invoice item name",
          price: 10,
          invoice_id: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "invoice item name 2",
          price: 20,
          invoice_id: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      { include: [{ model: InvoiceItemModel }] }
    );

    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
    }

    const invoiceDb = await facade.find(input);

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBeDefined();
    expect(invoiceDb.name).toBe(invoiceCreated.name);
    expect(invoiceDb.document).toBe(invoiceCreated.document);
    expect(invoiceDb.address.street).toBe(invoiceCreated.street);
    expect(invoiceDb.address.number).toBe(invoiceCreated.number);
    expect(invoiceDb.address.complement).toBe(invoiceCreated.complement);
    expect(invoiceDb.address.city).toBe(invoiceCreated.city);
    expect(invoiceDb.address.state).toBe(invoiceCreated.state);
    expect(invoiceDb.address.zipCode).toBe(invoiceCreated.zipCode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].id).toBe(invoiceCreated.items[0].id);
    expect(invoiceDb.items[0].name).toBe(invoiceCreated.items[0].name);
    expect(invoiceDb.items[0].price).toBe(invoiceCreated.items[0].price);
    expect(invoiceDb.items[1].id).toBe(invoiceCreated.items[1].id);
    expect(invoiceDb.items[1].name).toBe(invoiceCreated.items[1].name);
    expect(invoiceDb.items[1].price).toBe(invoiceCreated.items[1].price);
    expect(invoiceDb.createdAt).toStrictEqual(invoiceCreated.createdAt);
    expect(invoiceDb.total).toBe(30);
  });
});