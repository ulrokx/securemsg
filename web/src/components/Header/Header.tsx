import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Header = () => {
  const { user, logout, loading } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">SecureMSG</Typography>
            <Box ml="auto" display="flex" alignItems="center">
              {loading ? (
                <CircularProgress
                  color="inherit"
                  sx={{ mr: 4 }}
                />
              ) : user ? (
                <>
                  <Typography variant="h6" mr="2rem">
                    Hello, {user.username}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    variant="contained"
                    color="secondary"
                    sx={{ mr: 2 }}
                    to="/register">
                    Register
                  </Button>
                  <Button
                    component={Link}
                    variant="contained"
                    color="secondary"
                    to="/login">
                    Log In
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Outlet />
    </>
  );
};
