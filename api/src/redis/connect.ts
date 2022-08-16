import Redis from "ioredis";
import { isProduction } from "../util/isProduction";

export const connectRedis = () => {
  if (isProduction()) {
    return new Redis({
      port: 6379,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
    });
  } else {
    return new Redis();
  }
};
