import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Modal,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ResponsiveAppBar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  const { _id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/users/${_id}`
      );
      const data = response.data.user;
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);

      const userLogged = localStorage.getItem("user");
      const userParsed = JSON.parse(userLogged);
      setAdminName(userParsed.name);
    };
    getUserById();
  }, [_id]);

  const updateUser = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalMessage("New Password and Confirm Password do not match!");
      setShowModal(true);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${_id}`, {
        name,
        email,
        role,
        password: newPassword, // Only send new password if it's not empty
      });
      setModalMessage("User has been updated successfully!");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setModalMessage("Failed to update user. Please try again.");
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalMessage === "User has been updated successfully!") {
      navigate("/admin/userlist");
    }
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
        <AdminSidebar/>
        <Container maxWidth="sm" style={{marginTop:"50px"}}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Edit User
          </Typography>
          <Box component="form" onSubmit={updateUser} noValidate sx={{ mt: 1 }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              helperText="Please select the user role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Container>

        {/* Modal */}
        <Modal open={showModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Update Status
            </Typography>
            <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleCloseModal}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </>
  );
};

export default EditUser;
