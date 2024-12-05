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
  Modal,
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import api from "../Api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Regex pattern for validating email
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });
      setOpenModal(true);
    } catch (error) {
      setError("Failed to register. Please try again.");
    }
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/login");
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Sans, Arial, sans-serif",
      fontWeight: "bold",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
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
                Register
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <Box
                component="form"
                noValidate
                onSubmit={registerUser}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={Boolean(emailError)}
                  helperText={emailError}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validateEmail(e.target.value)) {
                      setEmailError("");
                    } else {
                      setEmailError("Please enter a valid email address");
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  Already have an account? <Link to="/login">Login</Link>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Modal */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 300,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 24,
                p: 3,
              }}
            >
              <Typography variant="h6" component="h2" align="center">
                Registration Successful
              </Typography>
              <Typography sx={{ mt: 2 }} align="center">
                Your account has been successfully created!
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseModal}
                >
                  Go to Login
                </Button>
              </Box>
            </Box>
          </Modal>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Register;
