import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Check stock usecase unit test", () => {

  it("should check stock", async () => {
    // repositorio
    const productRepository = MockRepository();

    // usecase
    const usecase = new CheckStockUseCase(productRepository);

    // input
    const input = {
      productId: "1",
    }
    const result = await usecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.productId).toBe("1");
    expect(result.stock).toBe(10);

  });


});