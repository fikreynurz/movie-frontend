import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Movie = ({ category }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log(`Fetching ${category} movies...`);
        const endpoint = category === "popular" 
          ? `https://api.themoviedb.org/3/movie/popular?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`
          : `https://api.themoviedb.org/3/movie/now_playing?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`;
        const response = await axios.get(endpoint);
        console.log(`${category} movies fetched:`, response.data.results);
        setMovies(response.data.results);
      } catch (error) {
        console.error(`Error fetching ${category} movies:`, error);
      }
    };
    fetchMovies();
  }, [category]);

  if (!movies || movies.length === 0) {
    return <Typography variant="h5">No {category} movies found or loading...</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {movies.slice(0, 10).map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={movie.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px', boxShadow: 3 }}>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              sx={{ height: 350, objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" noWrap>
                {movie.title}
              </Typography>
              <Typography variant="body2" color="white">
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
  );
};

export default Movie;
