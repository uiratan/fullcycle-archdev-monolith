import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(input: Invoice): Promise<Invoice> {
    const invoiceDb = await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      items: input.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoice_id: input.id.id,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
      { include: [{ model: InvoiceItemModel }] }
    );

    return new Invoice({
      id: new Id(invoiceDb.id),
      name: invoiceDb.name,
      document: invoiceDb.document,
      address: new Address({
        street: invoiceDb.street,
        number: invoiceDb.number,
        complement: invoiceDb.complement,
        city: invoiceDb.city,
        state: invoiceDb.state,
        zipCode: invoiceDb.zipCode,
      }),
      items: invoiceDb.items.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      })),
      createdAt: invoiceDb.createdAt,
      updatedAt: invoiceDb.updatedAt
    });
  }

  async find(id: string): Promise<Invoice> {
    let invoiceModel: InvoiceModel;

    try {
      invoiceModel = await InvoiceModel.findOne({
        where: { id },
        include: ["items"],
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error(`Invoice with ${id} not found`);
    }
      
    const itens = invoiceModel.items.map((item) => new InvoiceItem({
      id: new Id(item.id),
      name: item.name,
      price: item.price,
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt
    }));

    return new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address({
        street: invoiceModel.street,
        number: invoiceModel.number,
        complement: invoiceModel.complement,
        city: invoiceModel.city,
        state: invoiceModel.state,
        zipCode: invoiceModel.zipCode,
      }),
      items: itens,
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt
    });

  }
};