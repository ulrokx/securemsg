import localDataSource from "./localDataSource";
import prodDataSource from "./prodDataSource";
import { isProduction } from "../util/isProduction";
import entities from "./entities";

export const connectDb = async () => {
  if (isProduction()) {
    await prodDataSource.initialize();
    entities.forEach(e => e.useDataSource(prodDataSource));
  } else {
    await localDataSource.initialize();
    entities.forEach(e => e.useDataSource(localDataSource));
  }
};
