import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogin = async () => {
    try {
      await login({
        variables: { data: { username, password } },
      });
      setTimeout(() => navigate("/"), 500);
    } catch (e) {
      setError(
        "Sorry, but the username or password you entered is incorrect."
      );
    }
  };
  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
        rowGap: "1rem",
        margin: "0 auto",
        height: "80vh",
      }}>
      <Typography variant="h2" mt="30vh">
        Log In
      </Typography>
      <TextField
        label="Username"
        onChange={handleUsernameChange}
        value={username}
      />
      <TextField
        label="Password"
        onChange={handlePasswordChange}
        value={password}
        type="password"
      />
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleLogin}>
        Log In
      </Button>
    </Box>
  );
};
