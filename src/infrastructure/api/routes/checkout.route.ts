import express, { Request, Response } from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import OrderRepository from "../../../modules/checkout/repository/order.repository";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new PlaceOrderUseCase(
    new OrderRepository(),
    ClientAdmFacadeFactory.create(),
    ProductAdmFacadeFactory.create(),
    StoreCatalogFacadeFactory.create(),   
    InvoiceFacadeFactory.create(),
    PaymentFacadeFactory.create()
    );
  try {
    const checkoutInputDto = {     
      clientId: req.body.clientId,     
      products: req.body.products
    };
    const output = await usecase.execute(checkoutInputDto);   
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
