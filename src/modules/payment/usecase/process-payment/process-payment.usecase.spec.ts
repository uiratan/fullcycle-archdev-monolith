import Id from "../../../@shared/domain/value-object/id.value-object";
import { Transaction } from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

describe("Process Payment UseCase unit test", () => {

  it("should process a payment", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
      status: "approved",
    });
    
    const MockRepositoryApproved = () => {
      return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
      };
    };

    const paymentRepository = MockRepositoryApproved();
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 100
    };

    const result = await usecase.execute(input);
    
    expect(result.transactionId).toBe(transaction.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });

  it("should not process a payment", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 50,
      orderId: "1",
      status: "declined",
    });
    
    const MockRepositoryDeclined = () => {
      return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
      };
    };

    const paymentRepository = MockRepositoryDeclined();
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 50
    };

    const result = await usecase.execute(input);
    
    expect(result.transactionId).toBe(transaction.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(50);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });

});

