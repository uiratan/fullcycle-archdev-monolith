import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import ClientModel from "../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import AdmProductModel from "../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import { migrator } from "../db-migrations/config/migrator";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import { productRoute } from "./routes/product.route";

export const app: Express = express();

app.use(express.json());

app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/checkout", checkoutRoute);
// app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;
let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });    
 
  sequelize.addModels([      
    ClientModel,
    AdmProductModel,
    StoreCatalogProductModel,
    OrderModel, 
    OrderItemModel,
    InvoiceModel, 
    InvoiceItemModel,
    TransactionModel
  ]);

  migration = migrator(sequelize);
  await migration.up();
}

setupDb();
