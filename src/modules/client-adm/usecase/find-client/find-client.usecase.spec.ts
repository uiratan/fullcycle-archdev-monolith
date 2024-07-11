import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUsecase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "a@a.com",
  address: "address 1",
});

const MockRepository = () => {
  return {
    add: jest.fn(), // nao retorna nada pq o retorno de ClientGateway é void
    find: jest.fn().mockReturnValue(Promise.resolve(client)), // nao retorna nada agora
  };
};

describe("Find Client usecase unit test", () => {

  it("should find a client", async () => {

    const clientRepository = MockRepository();
    const usecase = new FindClientUsecase(clientRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.email).toEqual(client.email);
  });

});