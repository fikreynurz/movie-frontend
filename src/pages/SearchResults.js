import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom'; // Tidak perlu gunakan navigate di sini

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const handleSearch = async () => {
    if (query === '') return;  // Cegah pencarian kosong

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${query}&page=1`
      );
      setMovies(response.data.results);
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
            onKeyDown={handleKeyDown} // Trigger search on enter
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
      
      {/* Display search results */}
      <Grid container spacing={4} style={{ marginTop: '20px' }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={movie.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{ height: 350, objectFit: 'cover' }} // Keep image size consistent
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  {movie.title.length > 20 ? `${movie.title.slice(0, 20)}...` : movie.title} {/* Limit title length */}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {movie.release_date}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/movie/${movie.id}`}
                onClick={() => console.log(`Navigating to /movie/${movie.id}`)}
                sx={{ width: '100%', marginTop: 'auto' }}
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SearchResults;
