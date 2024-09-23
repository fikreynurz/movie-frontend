import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Avatar, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';  // Tambahkan ikon pencarian
import logo from '../../assets/images/logo.png';  // Pastikan path ini benar
import FilterModal from '../Filter/FilterModal';  // Import modal filter

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login
  const [role, setRole] = useState(''); // Role bisa 'user' atau 'admin'
  const [name, setName] = useState(''); // Role bisa 'user' atau 'admin'
  const [profilePic, setProfilePic] = useState(''); // Link ke foto profil
  const [searchQuery, setSearchQuery] = useState('');  // State untuk search query
  const [suggestions, setSuggestions] = useState([]);  // State untuk menyimpan saran pencarian
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
  const userParsed = JSON.parse(user)

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
      setRole(userParsed.role)
      setName(userParsed.name)
    }
  })

  const handleLogin = () => {
    navigate('/login')  
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
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

  const handleSearch = () => {
    if (searchQuery !== '') {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = async (event, value) => {
    setSearchQuery(value);
    if (value) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${value}&page=1`
        );
        console.log(response.data.results);
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]);  // Kosongkan suggestions jika input kosong
    }
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

        {/* Input Search dengan Autocomplete */}
        <Autocomplete
          freeSolo
          options={suggestions.map((option) =>
            option.title ? option.title : option.name  // Tampilkan title jika ada, jika tidak name
          )}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Movies or Actors"
              variant="outlined"
              size="small"
              value={searchQuery}
              onKeyDown={handleKeyDown}  // Trigger pencarian ketika Enter ditekan
              sx={{
                backgroundColor: 'white',  // Latar belakang putih
                borderRadius: '4px',  // Membuat ujung kotak search menjadi rounded
                marginRight: '10px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',  // Hilangkan border default
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',  // Warna border saat hover
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

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
              <MenuItem onClick={handleClose}>Name: {name}</MenuItem>
              <MenuItem onClick={handleClose}>Role: {role}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            {/* Profile button */}
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
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
