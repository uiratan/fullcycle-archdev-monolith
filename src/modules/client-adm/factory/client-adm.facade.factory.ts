import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    const findUsecase = new FindClientUsecase(clientRepository);
    const addUsecase = new AddClientUsecase(clientRepository);

    const facade = new ClientAdmFacade({
      findUsecase: findUsecase,
      addUsecase: addUsecase
    });

    return facade;
  }
}