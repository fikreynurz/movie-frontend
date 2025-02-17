import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Autocomplete } from '@mui/material';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk routing
import api from '../Api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]); // Menyimpan saran pencarian
  const navigate = useNavigate();  // Gunakan navigate untuk redirect

  const handleSearch = () => {
    if (query === '') return;  // Jika input kosong, tidak melakukan pencarian
    navigate('/search', { state: { query } });
  };

  // Fetch autocomplete suggestions saat user mengetik
  const handleInputChange = async (event, value) => {
    setQuery(value);
    if (value) {
      try {
        const response = await api.get(
          `/movies/search?query=${value}`
        );
        console.log(response.data.results);
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]); // Kosongkan suggestions jika input kosong
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
        Search Movies and Actors
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Autocomplete
            freeSolo
            options={suggestions.map((option) =>
              option.title ? option.title : option.name  // Jika title ada, tampilkan title, jika tidak tampilkan name
            )}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Movies or Actors"
                variant="outlined"
                fullWidth
                value={query}
                onKeyDown={handleKeyDown}  // Menambahkan handler untuk enter
              />
            )}
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
