import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    role: '', // Role is now handled as a dropdown
    password: '',
    id: '',
  });

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = localStorage.getItem("user")
      const userParsed = JSON.parse(user)
      const token = userParsed.token
      console.log(user)
      const response = await axios.get('http://localhost:5000/api/users', {headers: {"Authorization" : `Bearer ${token}`}});
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleOpen = (user = { name: '', email: '', role: '', password: '' }) => {
    setCurrentUser(user);
    setEditMode(Boolean(user._id)); // if _id exists, it's edit mode
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser({ name: '', email: '', role: '', password: '' }); // Reset state
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Update user
        await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, currentUser);
      } else {
        // Add new user
        await axios.post('http://localhost:5000/api/users/register', currentUser);
      }
      fetchUsers(); // Refresh user list after submission
      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <div>
      <AdminSidebar/>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit User */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Edit the details of the user.' : 'Enter the details for the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentUser.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={currentUser.email}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={currentUser.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password" // Set type to password
            fullWidth
            value={currentUser.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
