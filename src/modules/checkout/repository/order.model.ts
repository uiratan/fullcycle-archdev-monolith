import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Product } from "../domain/product.entity";
import ClientOrderModel from "./client.model";
import ProductOrderModel from "./product.model";

@Table({
  tableName: "order",
  timestamps: false  
})
export default class OrderModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @ForeignKey(() => ClientOrderModel)
  client_id: string;

  @BelongsTo(() => ClientOrderModel)
  client: ClientOrderModel;

  @HasMany(() => ProductOrderModel)
  products: Product[];

  @Column({ allowNull: false })
  invoiceId: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;

}