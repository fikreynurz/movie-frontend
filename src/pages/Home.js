import React from 'react';
import { Container, Box } from '@mui/material';
import Movie from '../components/Movie/Movie';
import Carousel from '../components/Carousel/Carousel';
import Header from '../components/Header/Header';

const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>
          <Carousel />
        </Box>
        <Box my={4}>
          <Movie />
        </Box>
      </Container>
    </>
  );
};

export default Home;
