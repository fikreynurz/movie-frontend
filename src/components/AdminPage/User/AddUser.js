import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ResponsiveAppBar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  // UseEffect to get admin name from localStorage on component mount
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("user");
    if (userLoggedIn) {
      const userParsed = JSON.parse(userLoggedIn);
      setAdminName(userParsed.name); // Make sure to access 'name' correctly
    }
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
        role,
      });
      navigate("/admin/user");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Sans, Arial, sans-serif",
      fontWeight: "bold"
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AdminSidebar/>
        <Container maxWidth="sm" style={{ marginTop: "50px" }}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h4" align="center" gutterBottom>
              Add New User
            </Typography>
            <form onSubmit={saveUser}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Role"
                    variant="outlined"
                    fullWidth
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "20px" }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AddUser;
