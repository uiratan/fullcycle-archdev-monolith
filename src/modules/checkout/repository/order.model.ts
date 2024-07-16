import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductOrderModel from "./product.model";
import ClientOrderModel from "./client.model";

@Table({
  modelName: 'order-table',
  tableName: 'order',
  timestamps: false  
})
export default class OrderModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientOrderModel)
  declare client_id: string;

  @BelongsTo(() => ClientOrderModel)
  declare client: ClientOrderModel;

  @HasMany(() => ProductOrderModel, {onUpdate: 'CASCADE'})
  declare products: ProductOrderModel[];

  @Column({ allowNull: false })
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

}