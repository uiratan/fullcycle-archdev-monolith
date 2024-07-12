import ValueObject from "../../@shared/domain/value-object/value-object.interface";

type AddressProps = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export default class Address implements ValueObject {
  _street: string;
  _number: string;
  _complement: string;
  _city: string;
  _state: string;
  _zipCode: string;

  constructor(props: AddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
  }

  
  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get zip(): string {
    return this._zipCode;
  }

  get address(): string {
    return `${this._street}, ${this._number}, ${this._zipCode} ${this._city}`;
  }

  get addressWithComplement(): string {
    return `${this._street}, ${this._number}, ${this._complement}, ${this._zipCode} ${this._city}`;
  }

  toString() {
    return `${this._street}, ${this._number}, ${this._zipCode} ${this._city}`;
  }

}