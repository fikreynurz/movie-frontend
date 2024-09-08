import React from 'react';
import { Container, Box , Typography} from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';  // Carousel untuk Recent Movies
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';

const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        {/* Search bar di bagian atas */}
        <Box my={4}>
          <Search />
        </Box>

        {/* Carousel Recent Movies */}
        <Box my={4}>
          <RecentCarousel />
        </Box>

        {/* Section for Popular Movies */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Popular Movies
          </Typography>
          <Movie category="popular" />  {/* Menampilkan Popular Movies */}
        </Box>

        {/* Section for Recent Movies */}
        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Recent Movies
          </Typography>
          <Movie category="recent" />  {/* Menampilkan Recent Movies */}
        </Box>
      </Container>
    </>
  );
};

export default Home;
