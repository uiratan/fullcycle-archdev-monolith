import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderItemModel from "./order-item.model";

@Table({
  modelName: 'order-table',
  tableName: 'order',
  timestamps: false  
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare clientId: string;

  @Column({ allowNull: false })
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare status: string;

  @HasMany(() => OrderItemModel, {onUpdate: 'CASCADE'})
  declare products: OrderItemModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

}