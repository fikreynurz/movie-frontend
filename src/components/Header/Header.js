import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Avatar, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/images/logo.png';
import FilterModal from '../Filter/FilterModal';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
  const userParsed = JSON.parse(user)

  useEffect(() => {
    const user = localStorage.getItem("user");
    let userParsed = null;
  
    if (user) {
      userParsed = JSON.parse(user);
    }
  
    if (userParsed) {  // Cek apakah userParsed tidak null
      setIsLoggedIn(true);
      setRole(userParsed.role);
      setName(userParsed.name);
    }
  }, []);  // Tidak perlu user atau userParsed di dependency array
  

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setAnchorEl(null);
    setRole('');
    setProfilePic('');
    navigate('/');
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
          `http://localhost:5000/api/movies/search?query=${value}`
        );
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: 1100 }}>
      <Toolbar>
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

        {role !== 'admin' && (
          <>
          <Autocomplete
            freeSolo
            options={suggestions.map((option) =>
              option.title ? option.title : option.name
            )}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Movies or Actors"
                variant="outlined"
                size="small"
                value={searchQuery}
                onKeyDown={handleKeyDown}
                sx={{
                  backgroundColor: '#121212', // Match dark theme background
                  borderRadius: '4px',
                  marginRight: '10px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#2196f3', // Blue border
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2', // Darker blue on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2', // Darker blue when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#90caf9', // Light blue for label
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff', // White text inside input
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#90caf9', // Light blue for search icon
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
            <FilterModal />
          </>
        )}

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
