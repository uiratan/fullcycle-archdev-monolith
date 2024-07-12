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
      // id: "1",
      name: "Client 1",
      email: "a@a.com",
      address: "address 1",
    };

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);

  });

});