import { DataSource } from "typeorm";
import { Channel } from "../models/Channel";
import { Message } from "../models/Message";
import { User } from "../models/User";
import entities from "./entities";

const localDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "securemsg",
  synchronize: true,
  entities,
});
export default localDataSource;
