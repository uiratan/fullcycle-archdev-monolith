import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientAdmFacadeFactory from "./client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address.value-object";

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
      email: "client@x.com",
      document: "000",
      address: new Address({
        street: "Rua 123",
        number: "99",
        complement: "Naquela casa",
        city: "Somewhere",
        state: "PI",
        zipCode: "88888-888",
      }),
    }


    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.document).toBe(input.document)
    expect(client.street).toBe(input.address.street)
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "client@x.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Naquela casa",
      city: "Somewhere",
      state: "PI",
      zipcode: "88888-888",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await ClientModel.create(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.street);
    expect(client.address.number).toBe(input.number);
    expect(client.address.complement).toBe(input.complement);
    expect(client.address.city).toBe(input.city);
    expect(client.address.state).toBe(input.state);
    expect(client.address.zipCode).toBe(input.zipcode);
  });

});