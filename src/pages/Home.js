import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Tambahkan Link dari react-router-dom

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);  // Loading state untuk popular movies
  const [loadingRecent, setLoadingRecent] = useState(true);    // Loading state untuk recent movies

  // Fetch Popular and Recent movies dari API TMDB
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);  // Set loading jadi true saat mulai fetch data popular
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/popular`
        );
        setPopularMovies(response.data.slice(0, 5)); // Batasi jumlah film menjadi 5
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoadingPopular(false);  // Set loading jadi false setelah fetch data selesai
      }
    };

    const fetchRecentMovies = async () => {
      setLoadingRecent(true);  // Set loading jadi true saat mulai fetch data recent
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/recent`
        );
        setRecentMovies(response.data.slice(0, 5)); // Batasi jumlah film menjadi 5
      } catch (error) {
        console.error("Error fetching recent movies:", error);
      } finally {
        setLoadingRecent(false);  // Set loading jadi false setelah fetch data selesai
      }
    };

    fetchPopularMovies();
    fetchRecentMovies();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box my={4}>
          <RecentCarousel />
        </Box>

        {/* Popular Movies Section */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Popular Movies
          </Typography>

          {loadingPopular ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {popularMovies.map((movie) => (
                  <Movie key={movie.id} movies={[movie]} />
                ))}
              </Box>
              {/* Tombol "View More" untuk Popular Movies */}
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
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {recentMovies.map((movie) => (
                  <Movie key={movie.id} movies={[movie]} />
                ))}
              </Box>
              {/* Tombol "View More" untuk Recent Movies */}
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
