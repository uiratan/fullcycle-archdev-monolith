import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

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
    const repository = new ClientRepository();
    const addUsecase = new AddClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: undefined,
    });

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
    const repository = new ClientRepository();
    const findUsecase = new FindClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: undefined,
      findUsecase: findUsecase,
    });

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