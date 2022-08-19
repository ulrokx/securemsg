import { ApolloProvider } from "@apollo/client";
import { Router } from "react-router-dom";
import Routes from "./components/Router/Router";
import createClient from "./graphql/client";

function App() {
  const client = createClient();
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
