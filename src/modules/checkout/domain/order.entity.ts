import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "./order-item.entity";

type OrderProps = {
  id?: Id;
  clientId: string;
  products: OrderItem[];
  status?: string;
  invoiceId?: string;
}

export default class Order extends BaseEntity implements AggregateRoot {

  private _clientId: string;
  private _products: OrderItem[];
  private _status: string;
  private _invoiceId?: string;

  constructor(props: OrderProps) {
    super(props.id);
    this._clientId = props.clientId;
    this._products = props.products;
    this._status = props.status || "pending" ;
    this._invoiceId = props.invoiceId;
  }

  approved() {
    this._status = "approved";
  }

  get clientId(): string {
    return this._clientId;
  }

  get products(): OrderItem[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }
  
  get total(): number {
    return this._products.reduce((total, product) => total + product.salesPrice, 0);
  }

  get invoiceId(): string | undefined {
    return this._invoiceId;
  }

  set invoiceId(value: string | undefined) {
    this._invoiceId = value;
  }
}