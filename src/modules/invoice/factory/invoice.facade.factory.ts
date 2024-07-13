import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create() {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUsecase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: findUsecase,
    });

    return facade;
  }
}