import "reflect-metadata";
import { startApolloServer } from "./graphql/server";
import { connectDb } from "./orm/connect";
import { connectRedis } from "./redis/connect";
import dotenv from "dotenv";

const main = async () => {
  dotenv.config();
  const redisSession = connectRedis();
  const redisPub = connectRedis();
  const redisSub = connectRedis();
  await connectDb();
  await startApolloServer({ redisSession, redisPub, redisSub });
};
main();
