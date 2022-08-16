import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";
import { User } from "../models/User";
import localDataSource from "../orm/localDataSource";
import Redis from "ioredis";
import session from "express-session";
import ConnectRedis from "connect-redis";
import { isProduction } from "../util/isProduction";
import { authChecker } from "./authorization";
import { ChannelResolver } from "../resolvers/ChannelResolver";

const PORT = process.env.PORT || 4000;

export async function startApolloServer({
  redis,
}: {
  redis: Redis;
}) {
  const schema = await buildSchema({
    resolvers: [UserResolver, ChannelResolver],
    authChecker: authChecker
  });
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    context: ({ req, res }) => ({ req, res, redis }),
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  const RedisStore = ConnectRedis(session);
  app.use(
    session({
      secret: "secret",
      resave: false,
      store: new RedisStore({
        client: redis,
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
    })
  );
  app.set("trust proxy", !isProduction());
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:4000/graphql",
      ],
    },
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
  );
}
