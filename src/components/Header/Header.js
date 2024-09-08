import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // Pastikan path ini sesuai dengan folder Anda
import FilterModal from '../FilterModal'; // Import modal filter

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login
  const [role, setRole] = useState(''); // Role bisa 'user' atau 'admin'
  const [profilePic, setProfilePic] = useState(''); // Link ke foto profil

  const handleLogin = () => {
    setIsLoggedIn(true);
    setRole('admin'); // Ganti sesuai dengan role dari backend
    setProfilePic('https://via.placeholder.com/150'); // Ganti dengan URL foto profil yang sebenarnya
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAnchorEl(null);
    setRole('');
    setProfilePic('');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: 1100 }}>  {/* Menggunakan position sticky */}
      <Toolbar>
        {/* Logo dan judul JAKRIE */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          JAKRIE
        </Typography>

        {/* Tombol Filter di sebelah kiri tombol Login */}
        <FilterModal />  {/* Modal Filter yang bisa di-trigger dari Header */}

        {/* Login atau Profile setelah login */}
        {isLoggedIn ? (
          <>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar src={profilePic} alt="Profile" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Role: {role}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
