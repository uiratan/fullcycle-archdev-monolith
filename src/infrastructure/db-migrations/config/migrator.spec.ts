import { Sequelize } from "sequelize-typescript";
import { migrator } from "./migrator";

describe("Migrations unit test", () => {
  let sequelize: Sequelize;
  let migration: any;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false
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
    
  });

});
