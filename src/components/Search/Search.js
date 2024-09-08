import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk routing

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title'); // Default: pencarian berdasarkan judul
  const navigate = useNavigate();  // Gunakan navigate untuk redirect

  const handleSearch = async () => {
    if (query === '') return;  // Jika input kosong, tidak melakukan pencarian

    try {
      // Redirect ke halaman search dengan query dan tipe pencarian (judul/aktor) sebagai state
      navigate('/search', { state: { query, searchType } });
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
        Search Movies or Actors
      </Typography>

      {/* Radio Group untuk memilih pencarian berdasarkan Judul atau Aktor */}
      <FormControl component="fieldset" style={{ marginBottom: '20px' }}>
        <FormLabel component="legend">Search By</FormLabel>
        <RadioGroup
          row
          aria-label="search-type"
          name="search-type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <FormControlLabel value="title" control={<Radio />} label="Title" />
          <FormControlLabel value="actor" control={<Radio />} label="Actor" />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            label={`Search by ${searchType}`}
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
