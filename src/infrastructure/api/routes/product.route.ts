import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const productAdminFacade = ProductAdmFacadeFactory.create();
  const storeCatalogFacade = StoreCatalogFacadeFactory.create();

  const productDto = {
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    stock: req.body.stock
  };

  try {
    const output = await productAdminFacade.addProduct(productDto);

    console.log(output);
    
    const product = await storeCatalogFacade.find({ id: output.id });

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
