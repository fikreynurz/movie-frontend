import React from 'react';
import { Container, Box } from '@mui/material';
import PopularMovies from '../components/PopularMovies/PopularMovies';
import PopularCarousel from '../components/PopularCarousel/PopularCarousel';
import Header from '../components/Header/Header';

const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>
          <PopularCarousel />
        </Box>
        <Box my={4}>
          <PopularMovies />
        </Box>
      </Container>
    </>
  );
};

export default Home;
    