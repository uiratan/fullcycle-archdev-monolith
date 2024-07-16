import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create(); 
  const clientDto = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    document: req.body.document,
    address: {
      street: req.body.address.street,
      number: req.body.address.number,
      complement: req.body.address.complement,
      city: req.body.address.city,
      state: req.body.address.state,
      zipCode: req.body.address.zipCode
    }
  };
  
  try {
    await clientFacade.add(clientDto);
    const output = await clientFacade.find({ id: "111" });
    // console.log(output);
    
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

