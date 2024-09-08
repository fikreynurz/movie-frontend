import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk routing

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();  // Gunakan navigate untuk redirect

  const handleSearch = async () => {
    if (query === '') return;  // Jika input kosong, tidak melakukan pencarian

    try {
      // Redirect ke halaman search dengan query sebagai state
      navigate('/search', { state: { query } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Search Movies
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            label="Search for a movie"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}  // Menambahkan handler untuk enter
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
