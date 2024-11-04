import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Box,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import DarkTheme from "../../theme";
import api from "../Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token); // Simpan token ke localStorage
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "admin") {
        navigate("/admin/user");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const responseGoogle = async (response) => {
    const { credential } = response;
    try {
      const res = await api.post(
        "/users/auth/google/login",
        { idToken: credential }
      );
      const data = res.data;
      localStorage.setItem("token", data.token); // Simpan token di localStorage
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "admin") {
        navigate("/admin/user");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Failed to login with Google. Please try again.");
    }
  };

  return (
    <>
      <ThemeProvider theme={DarkTheme}>
        <CssBaseline />
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Card sx={{ width: "100%", p: 3 }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h1"
                align="center"
                gutterBottom
              >
                Login
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <Box
                component="form"
                noValidate
                onSubmit={loginUser}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Box>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </Box>
              </Box>
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <GoogleOAuthProvider clientId="766915372596-ls57rs02tq30ngto02smgf49finmkg3o.apps.googleusercontent.com">
                  <GoogleLogin
                    type="icon"
                    onSuccess={responseGoogle}
                    onError={() => setError("Login failed")}
                  />
                </GoogleOAuthProvider>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Login;
