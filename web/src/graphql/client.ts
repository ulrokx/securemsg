import {
  ApolloClient,
  from,
  InMemoryCache,
} from "@apollo/client";
import { httpLink } from "./httpLink";

const createClient = () => {
  const linkChain = from([httpLink]);
  return new ApolloClient({
    connectToDevTools: true,
    link: linkChain,
    uri: "http://localhost:5173/graphql",
    cache: new InMemoryCache(),
  });
};

export default createClient;
