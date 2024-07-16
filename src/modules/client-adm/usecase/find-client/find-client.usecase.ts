import UseCaseInterface from "../../../@shared/domain/usecase/use-case.interface";
import Address from "../../../@shared/domain/value-object/address.value-object";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientInputDto, FindClientOutputDto } from "./find-client.usecase.dto";

export default class FindClientUsecase implements UseCaseInterface {
  private _clientRepository: ClientGateway;

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: FindClientInputDto) : Promise<FindClientOutputDto> {    
    // console.log(">>>>>>>>>>>>>>>>> FindClientUsecase");
    // console.log(input);
    
    const client = await this._clientRepository.find(input.id);    

    // console.log(client);
    
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      address: {
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };
  }
}