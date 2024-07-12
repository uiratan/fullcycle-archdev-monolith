import ValueObject from "./value-object.interface";

type AddressProps = {
  street: string;
  number: number;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export default class Address implements ValueObject {
  _street: string = "";
  _number: number = 0;
  _complement: string = "";;
  _city: string = "";
  _state: string = "";
  _zipCode: string = "";

  constructor(props: AddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;

    this.validate();
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }

    if (this._number <= 0) {
      throw new Error("Number must be greater than 0");
    }

    if (this._zipCode.length === 0) {
      throw new Error("Zip is required");
    }

    if (this._city.length === 0) {
      throw new Error("City is required");
    }
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
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