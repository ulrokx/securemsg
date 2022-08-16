import { buildSchema } from "type-graphql";

export const schema = buildSchema({
  resolvers: [__dirname + "/resolvers/*.ts"],
})