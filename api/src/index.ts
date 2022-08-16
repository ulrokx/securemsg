import "reflect-metadata";
import { startApolloServer } from "./graphql/server";
import { connectDb } from "./orm/connect";
import { connectRedis } from "./redis/connect";
import dotenv from "dotenv";

const main = async () => {
  dotenv.config();
  const redis = connectRedis();
  await connectDb();
  await startApolloServer({ redis });
};
main();
