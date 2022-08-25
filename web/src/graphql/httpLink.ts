import { createHttpLink } from "@apollo/client/link/http/createHttpLink";

export const httpLink = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});
