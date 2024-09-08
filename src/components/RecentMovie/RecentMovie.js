import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const RecentMovie = ({ limit }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchRecentMovies = async () => {
      console.log("Fetching recent movies...");
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`);
        console.log("Recent movies fetched:", response.data.results);
        setMovies(response.data.results.slice(0, limit));  // Batasi jumlah movie yang ditampilkan
      } catch (error) {
        console.error("Error fetching recent movies:", error);
      }
    };
    fetchRecentMovies();
  }, [limit]);

  console.log("Recent movies state:", movies);

  if (!movies || movies.length === 0) {
    return <Typography variant="h5">No recent movies found or loading...</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1c1c1c',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              sx={{ height: 350, objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
                {movie.title.length > 20 ? `${movie.title.substring(0, 17)}...` : movie.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movie.release_date}
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/movie/${movie.id}`}
              onClick={() => console.log(`Navigating to /movie/${movie.id}`)}
              sx={{ width: '100%', marginTop: 'auto', '&:hover': { backgroundColor: '#1976d2' } }}
            >
              View Details
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecentMovie;
