import { DataSource } from "typeorm";
import entities from "./entities";

const prodDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "securemsg",
  synchronize: true,
  entities,
});

export default prodDataSource;
