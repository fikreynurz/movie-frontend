import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Paper, Box } from '@mui/material';
import './PopularMovies.css';

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching the popular movies", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" component="div" gutterBottom align="center" color="primary">
          Popular Movies
        </Typography>
        <Grid container spacing={4}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardContent className="card-content">
                  <Typography variant="h6" component="div" className="card-title">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="card-date">
                    {movie.release_date}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PopularMovies;
