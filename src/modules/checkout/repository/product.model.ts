import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
  modelName: 'product-table',
  tableName: 'product_order',
  timestamps: false
})
export default class ProductOrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: true })
  declare description: string;

  @Column({ allowNull: true })
  declare salesPrice: number;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare order_id: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;

}