import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto";

export default class AddProductUsecase {

  private _productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      salesPrice: input.salesPrice,
      stock: input.stock
    };

    const product = new Product(props);

    // adicionar esse product no repositório de products, seja banco, api, arquivo, etc 
    // através da gateway
    this._productRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }
}