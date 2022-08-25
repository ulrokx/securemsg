import { ApolloProvider } from "@apollo/client";
import { Router } from "react-router-dom";
import Routes from "./components/Router/Router";
import { AuthProvider } from "./context/AuthContext";
import createClient from "./graphql/client";
import { ToastContainer } from "react-toastify";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { themeOptions } from "./context/theme";

function App() {
  const client = createClient();
  const theme = createTheme(themeOptions)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
        <ToastContainer />
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
