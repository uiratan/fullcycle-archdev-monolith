import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import ClientModel from "../../modules/client-adm/repository/client.model";
import { migrator } from "../db-migrations/config/migrator";
import { clientRoute } from "./routes/client.route";

export const app: Express = express();

app.use(express.json());

app.use("/client", clientRoute);
// app.use("/product", productRoute);
// app.use("/checkout", checkoutRoute);
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
    // AdmProductModel,
    // StoreCatalogProductModel,
    // OrderModel, 
    // OrderItemModel,
    // InvoiceModel, 
    // InvoiceItemModel,
    // TransactionModel
  ]);

  migration = migrator(sequelize);
  await migration.up();
}

setupDb();
