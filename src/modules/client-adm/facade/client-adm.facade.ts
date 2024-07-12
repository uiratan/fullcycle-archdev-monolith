import UseCaseInterface from "../../@shared/domain/usecase/use-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}
export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  constructor(usecasesProps: UseCaseProps) {
    this._findUsecase = usecasesProps.findUsecase;
    this._addUsecase = usecasesProps.addUsecase;
  }
  
  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }

  async find(id: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(id);
  }

}