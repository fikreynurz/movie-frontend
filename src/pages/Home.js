import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Button, Grid } from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';
import { Link } from 'react-router-dom';
import api from '../components/Api';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);
      try {
        const response = await api.get("/movies/popular?page=1&limit=5");
        setPopularMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoadingPopular(false);
      }
    };

    const fetchRecentMovies = async () => {
      setLoadingRecent(true);
      try {
        const response = await api.get("/movies/recent?page=1&limit=5");
        setRecentMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching recent movies:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchPopularMovies();
    fetchRecentMovies();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        {/* Carousel */}
        <Box my={4}>
          <RecentCarousel />
        </Box>

        {/* Popular Movies Section */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Popular Movies
          </Typography>

          {loadingPopular ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {popularMovies.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
                    <Movie movies={[movie]} />
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button component={Link} to="cat/popular-movies" variant="contained" color="primary">
                  View More
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Recent Movies Section */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Recent Movies
          </Typography>

          {loadingRecent ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {recentMovies.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
                    <Movie movies={[movie]} />
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button component={Link} to="cat/recent-movies" variant="contained" color="primary">
                  View More
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
