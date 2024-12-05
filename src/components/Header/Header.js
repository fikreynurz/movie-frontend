import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Menu, MenuItem, IconButton, Avatar, TextField, InputAdornment, Autocomplete, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  // Responsiveness check
  const isMobile = useMediaQuery('(max-width:600px)'); // True if screen is 600px or smaller

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

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: 1100 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo dan Nama Website */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexGrow: 1,
          }}
        >
          <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontSize: { xs: '1rem', sm: '1.5rem' },
            }}
          >
            JAKRIE
          </Typography>
        </Box>

        {/* Search Bar untuk Desktop */}
        {isLoggedIn && role === "user" && !isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
          <Autocomplete
            freeSolo
            options={suggestions.map((option) => option.title || option.name)}
            onInputChange={(event, value) => setSearchQuery(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Movies or Actors"
                size="small"
                sx={{
                  width: 300,
                  backgroundColor: 'white',
                  borderRadius: 1,
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/search', { state: { query: searchQuery } });
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    color: 'black', // Pastikan warna teks hitam
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          </Box>
        )}

        {/* Navigation Buttons */}
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              {/* Search Bar untuk Mobile */}
              {isLoggedIn && role === "user" && (
                <MenuItem>
                  <Autocomplete
                    freeSolo
                    options={suggestions.map((option) => option.title || option.name)}
                    onInputChange={(event, value) => setSearchQuery(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search"
                        size="small"
                        sx={{
                          width: '100%',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            navigate('/search', { state: { query: searchQuery } });
                            handleMobileMenuClose();
                          }
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </MenuItem>
              )}

              {isLoggedIn && role === 'user' && (
                <>
                  <MenuItem
                    onClick={() => {
                      navigate('/add-movie');
                      handleMobileMenuClose();
                    }}
                  >
                    Add Movie
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleMobileMenuClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>
                    <FilterModal />
                  </MenuItem>
                </>
              )}
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={handleMobileMenuClose}>Name: {name}</MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>Role: {role}</MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.clear();
                      setIsLoggedIn(false);
                      navigate('/');
                      handleMobileMenuClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={() => {
                    navigate('/login');
                    handleMobileMenuClose();
                  }}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {isLoggedIn && role === 'user' && (
              <>
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
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  color="inherit"
                >
                  <Avatar src={profilePic} alt="Profile" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => setAnchorEl(null)}>Name: {name}</MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>Role: {role}</MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.clear();
                      setIsLoggedIn(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;