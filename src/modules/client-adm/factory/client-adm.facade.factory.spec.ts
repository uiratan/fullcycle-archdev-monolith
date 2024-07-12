import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "./client-adm.facade.factory";

describe("ClientAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "a@a.com",
      address: "client 1 address",
    }    

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.address).toEqual(input.address);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "a@a.com",
      address: "client 1 address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const input = {
      id: "1",
    }

    const clientDb = await facade.find(input);

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toEqual(input.id);
    expect(clientDb.name).toEqual("Client 1");
    expect(clientDb.email).toEqual("a@a.com");
    expect(clientDb.address).toEqual("client 1 address");
  });

});