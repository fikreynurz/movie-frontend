import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CssBaseline,
  TablePagination,
} from "@mui/material";
import ResponsiveAppBar from "../AdminNavbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdminSidebar from "../AdminSidebar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // State for detail modal
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [adminName, setAdminName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/users");
      const userLogged = localStorage.getItem("user");
      const userParsed = JSON.parse(userLogged);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setAdminName(userParsed.name);
    };
    getUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [filterRole, searchQuery, users]);

  // Pagination logic: slice the filtered users based on the page and rowsPerPage
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleDelete = (id) => {
    setSelectedUsers([id]);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectedUsers.map(async (userId) => {
          await axios.delete(`http://localhost:5000/api/users/${userId}`);
        })
      );
      setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
      setSelectAll(false);
      setSelectedUsers([]);
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUsers([]);
  };

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true); // Open the detail modal
  };

  const closeDetailModal = () => {
    setShowDetailModal(false); // Close the detail modal
    setSelectedUser(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
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
      <ResponsiveAppBar adminName={adminName} onLogout={handleLogout} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AdminSidebar/>
        <Container maxWidth="lg" style={{ marginTop: "50px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            User List
          </Typography>

          {/* Filter Section */}
          <Grid container spacing={2} style={{ marginBottom: "20px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Filter by Role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Search by Name or Email"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
          </Grid>

          {selectedUsers.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowDeleteModal(true)}
              style={{ marginBottom: "20px" }}
            >
              Delete Selected Users
            </Button>
          )}

          <Button
            component={Link}
            to="/admin/addUser"
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
              marginLeft: selectedUsers.length > 0 ? "10px" : "0px",
            }}
          >
            Add User
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <AccountCircleIcon
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    Name
                  </TableCell>
                  <TableCell>
                    <EmailIcon
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    Email
                  </TableCell>
                  <TableCell>
                    <AdminPanelSettingsIcon
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    Role
                  </TableCell>
                  <TableCell align="center">
                    <PeopleAltIcon
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => handleShowDetails(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/admin/editUser/${user._id}`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onClose={closeDetailModal}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <>
                <DialogContentText>
                  <strong>Name:</strong> {selectedUser.name}
                </DialogContentText>
                <DialogContentText>
                  <strong>Email:</strong> {selectedUser.email}
                </DialogContentText>
                <DialogContentText>
                  <strong>Role:</strong> {selectedUser.role}
                </DialogContentText>
                {selectedUser.googleId && (
                  <DialogContentText>
                    <strong>Google ID:</strong> {selectedUser.googleId}
                  </DialogContentText>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDetailModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the selected users?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default UserList;
