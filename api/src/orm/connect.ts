import localDataSource from "./localDataSource";
import prodDataSource from "./prodDataSource";
import { isProduction } from "../util/isProduction";
import entities from "./entities";

export const dataSource = isProduction()
  ? prodDataSource
  : localDataSource;

export const connectDb = async () => {
  await dataSource.initialize();
  entities.forEach((e) => e.useDataSource(dataSource));
};
