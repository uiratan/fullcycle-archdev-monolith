import AddProductUsecase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  }
}

describe("Add Product usecase unit test", () => {
  
  it("should add a product", async() => {

    // repositorio
    const productRepository = MockRepository();
    
    // usecase
    const usecase = new AddProductUsecase(productRepository);

    // input
    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 150,
      stock: 10
    }

    
    // output
    const result = await usecase.execute(input);  

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.purchasePrice).toBe(input.purchasePrice);
    expect(result.stock).toBe(input.stock);
    
  });

})