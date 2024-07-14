import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode
      }),
      items: input.items.map((item) => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      }))
    });

    const generatedInvoice = await this.invoiceRepository.generate(invoice);
    
    return {
      id: generatedInvoice.id.id,
      name: generatedInvoice.name,
      document: generatedInvoice.document,
      street: generatedInvoice.address.street,
      number: generatedInvoice.address.number,
      complement: generatedInvoice.address.complement,
      city: generatedInvoice.address.city,
      state: generatedInvoice.address.state,
      zipCode: generatedInvoice.address.zipCode,
      items: generatedInvoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: generatedInvoice.total
    };

  }

}