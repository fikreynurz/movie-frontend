import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Card, CardMedia } from '@mui/material';

const Detail = () => {
  const { id } = useParams();  // Mengambil ID dari URL
  console.log("Movie ID:", id);  // Logging ID yang diambil dari URL

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      console.log("Fetching movie details...");  // Logging ketika memulai fetch data
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&append_to_response=credits,reviews`);
        console.log("Movie details fetched:", response.data);  // Logging hasil dari API
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {movie.release_date} | {movie.runtime} minutes
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Synopsis:</strong> {movie.overview}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Rating:</strong> {movie.vote_average} / 10
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Cast:</strong> {movie.credits.cast.slice(0, 5).map((actor) => actor.name).join(', ')}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Detail;
