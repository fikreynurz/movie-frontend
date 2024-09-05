import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Box, Typography } from '@mui/material';
import './Carousel.css';

const PopularCarousel = () => {
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
    <Box my={4}>
      <Typography variant="h4" component="h2" gutterBottom>
        Popular Movies
      </Typography>
      <Carousel autoPlay infiniteLoop showThumbs={false}>
        {movies.slice(0, 5).map((movie) => (
          <div key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
            <Typography variant="h5" component="h3" color="primary">
              {movie.title}
            </Typography>
          </div>
        ))}
      </Carousel>
    </Box>
  );
};

export default PopularCarousel;
