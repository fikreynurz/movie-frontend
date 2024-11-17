import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Avatar, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/images/logo.png';
import FilterModal from '../Filter/FilterModal';
import api from '../Api';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const user = localStorage.getItem("user");
    let userParsed = null;

    if (user) {
      userParsed = JSON.parse(user);
    }

    if (userParsed) {
      setIsLoggedIn(true);
      setRole(userParsed.role);
      setName(userParsed.name);
    }
  }, [user]);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      console.log("Movies fetched: ", response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
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

        {/* Tampilkan tombol hanya jika role adalah user */}
        {isLoggedIn && role === 'user' && (
          <>
            <Autocomplete
              freeSolo
              options={suggestions.map((option) => option.title ? option.title : option.name)}
              onInputChange={(event, value) => setSearchQuery(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Movies or Actors"
                  size="small"
                  color="inherit"
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/search', { state: { query: searchQuery } })}
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
            <Button color="inherit" onClick={() => navigate('/add-movie')}>
              Add Movie
            </Button>
            <FilterModal />
            <Button color="inherit" onClick={() => navigate('/profile')}>
              Profile
            </Button>
          </>
        )}

        {isLoggedIn ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
              <Avatar src={profilePic} alt="Profile" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>Name: {name}</MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>Role: {role}</MenuItem>
              <MenuItem onClick={() => { localStorage.clear(); setIsLoggedIn(false); navigate('/'); }}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
