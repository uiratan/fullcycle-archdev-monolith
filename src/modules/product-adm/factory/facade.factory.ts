import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUsecase from "../usecase/add-product/add-product.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUsecase = new AddProductUsecase(productRepository);
    // const checkStockUsecase = new CheckStockUsecase(productRepository);

    const productFacade = new ProductAdmFacade({ 
      addUseCase: addProductUsecase, 
      stockUseCase: undefined 
    });

    return productFacade;
  }
}