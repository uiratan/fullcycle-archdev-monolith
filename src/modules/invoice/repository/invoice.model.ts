import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({allowNull: false})
  id: string;

  @Column({allowNull: false})
  name: string;

  @Column({allowNull: false})
  document: string;

  @Column
  street: string;
  
  @Column
  number: string;

  @Column
  complement: string;

  @Column
  city: string;

  @Column
  state: string;

  @Column
  zipCode: string;

  @HasMany(() => InvoiceItemModel)
  items: InvoiceItemModel[];

  @Column({allowNull: false})
  createdAt: Date;

  @Column({allowNull: false})
  updatedAt: Date;
}

