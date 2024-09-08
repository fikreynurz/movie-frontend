import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const query = location.state?.query || '';
  const searchType = location.state?.searchType || 'title';  // Ambil searchType dari state
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query === '') return;
      console.log(`Fetching ${searchType} results for:`, query);

      try {
        let response;
        if (searchType === 'title') {
          // Pencarian berdasarkan judul
          response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${query}&page=1`
          );
        } else {
          // Pencarian berdasarkan aktor
          response = await axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${query}&page=1`
          );
        }

        const results = searchType === 'title' ? response.data.results : response.data.results.flatMap(person => person.known_for);
        setMovies(results);
        console.log("Search results:", results);
      } catch (error) {
        console.error(`Error fetching ${searchType} search results:`, error);
      }
    };

    fetchSearchResults();
  }, [query, searchType]);

  if (!movies || movies.length === 0) {
    return <Typography variant="h5">No results found for "{query}"</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Search Results for "{query}" by {searchType}
      </Typography>
      
      <Grid container spacing={4} style={{ marginTop: '20px' }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={movie.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{ height: 350, objectFit: 'cover' }} 
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  {movie.title || movie.name}
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
