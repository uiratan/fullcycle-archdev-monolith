import { Sequelize } from "sequelize-typescript";
import { migrator } from "./migrator";
import { SequelizeStorage, Umzug } from "umzug";

describe("Client repository unit test", () => {
  let sequelize: Sequelize;
  let migration: any;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([]);
    migration = migrator(sequelize);
    await migration.up();

  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  });

  it("should run migrations", async () => {
    const migrator = new Umzug({
      migrations: {
        glob: "../migrations/*.ts",
      },
      context: sequelize,
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });
    await migrator.up();
  });
  
});
