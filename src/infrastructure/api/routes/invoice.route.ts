import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const invoiceFactory = InvoiceFacadeFactory.create();
  try {
    const output = await invoiceFactory.find({id});
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

