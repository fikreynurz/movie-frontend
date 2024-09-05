import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import './Movie.css';

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("Fetching popular movies...");
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`);
        console.log("Popular movies fetched:", response.data.results);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching popular movies", error);
      }
    };
    fetchMovies();
  }, []);

  console.log("Popular movies state:", movies); // Logging movies

  return (
    <Grid container spacing={4}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie.id}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <CardContent className="card-content">
              <Typography variant="h5" component="div" className="card-title">
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
  );
};

export default PopularMovies;
