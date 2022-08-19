import { ApolloClient, InMemoryCache } from "@apollo/client";

const createClient = () => {
  return new ApolloClient({
    uri: "http://localhost:5173/graphql",
    cache: new InMemoryCache(),
  });
};

export default createClient;
