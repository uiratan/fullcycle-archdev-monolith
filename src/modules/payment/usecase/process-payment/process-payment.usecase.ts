import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import { Transaction } from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {

  constructor(private transactionRepository: PaymentGateway) {
  }

  async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId
    });  
    transaction.process();
    const transactionSaved = await this.transactionRepository.save(transaction);

    return {
      transactionId: transactionSaved.id.id,
      orderId: transactionSaved.orderId,
      amount: transactionSaved.amount,
      status: transactionSaved.status,
      createdAt: transactionSaved.createdAt,
      updatedAt: transactionSaved.updatedAt
    };
  }
}