import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';
import axios from 'axios';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);  // Loading state untuk popular movies
  const [loadingRecent, setLoadingRecent] = useState(true);    // Loading state untuk recent movies

  // Fetch Popular and Recent movies
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
        {/* Carousel tetap ditampilkan */}
        <Box my={4}>
          <RecentCarousel />  {/* Ini akan menampilkan carousel dengan recent movies */}
        </Box>
        
        {/* Popular Movies */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Popular Movies
          </Typography>

          {/* Tampilkan loading state jika data masih di-fetch */}
          {loadingPopular ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex',  gap: 2 }}>
              {popularMovies.map((movie) => (
                <Movie key={movie.id} movies={[movie]} />
              ))}
            </Box>
          )}
        </Box>

        {/* Recent Movies */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Recent Movies
          </Typography>

          {/* Tampilkan loading state jika data masih di-fetch */}
          {loadingRecent ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {recentMovies.map((movie) => (
                <Movie key={movie.id} movies={[movie]} />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
