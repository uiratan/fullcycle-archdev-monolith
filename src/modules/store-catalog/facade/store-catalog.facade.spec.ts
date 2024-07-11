import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("Store catalog facade unit test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {

    const facade = StoreCatalogFacadeFactory.create();
    
    const product = await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100
    });

    const result = await facade.find({ id: "1" });

    expect(result.id).toBe(product.id);
    expect(result.name).toBe(product.name);   
    expect(result.description).toBe(product.description);
    expect(result.salesPrice).toBe(product.salesPrice);
  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    const product = await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100
    });

    const product2 = await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200
    });

    const result = await facade.findAll();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe(product.id);
    expect(result.products[0].name).toBe(product.name);
    expect(result.products[0].description).toBe(product.description); 
    expect(result.products[0].salesPrice).toBe(product.salesPrice); 

    expect(result.products[1].id).toBe(product2.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].description).toBe(product2.description);
    expect(result.products[1].salesPrice).toBe(product2.salesPrice);
  });



});