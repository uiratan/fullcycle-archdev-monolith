import Address from "../../../@shared/domain/value-object/address.value-object";
import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(), // nao retorna nada pq o retorno de ClientGateway é void
    find: jest.fn(), // nao retorna nada agora
  };
};

describe("Add Client usecase unit test", () => {

  it("should add a client", async() => {

    const clientRepository = MockRepository();
    const usecase = new AddClientUsecase(clientRepository); // ainda nao existe, teste vai falhar
    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "000",
      address: new Address({
        street: "Rua 123",
        number:"99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode:"88888-888",
      }),
    }

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);

  });

});