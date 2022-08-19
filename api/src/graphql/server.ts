import { ApolloServer } from "apollo-server-express";
import ConnectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import { RedisPubSub } from "graphql-redis-subscriptions";
import http, { createServer } from "http";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { ChannelResolver } from "../resolvers/ChannelResolver";
import { MessageResolver } from "../resolvers/MessageResolver";
import { UserResolver } from "../resolvers/UserResolver";
import { isProduction } from "../util/isProduction";
import { authChecker } from "./authorization";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const PORT = process.env.PORT || 4000;

export async function startApolloServer({
  redisSession,
  redisPub,
  redisSub,
}: {
  redisSession: Redis;
  redisPub: Redis;
  redisSub: Redis;
}) {
  const pubSub = new RedisPubSub({
    publisher: redisPub,
    subscriber: redisSub,
  });
  const schema = await buildSchema({
    resolvers: [UserResolver, ChannelResolver, MessageResolver],
    authChecker: authChecker,
    pubSub,
  });
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    context: ({ req, res }) => ({
      req,
      res,
      redis: redisSession,
    }),
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  const RedisStore = ConnectRedis(session);
  app.use(
    session({
      secret: "secret",
      resave: false,
      store: new RedisStore({
        client: redisSession,
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
  app.get("/", (_, res) => {
    res.redirect("/graphql");
  });
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
