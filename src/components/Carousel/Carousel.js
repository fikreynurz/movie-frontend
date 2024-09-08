import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';  // Menggunakan Carousel dari React Bootstrap
import { Container, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecentCarousel = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching the recent movies", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Recent Movies
      </Typography>
      <Carousel>
        {movies.slice(0, 5).map((movie) => (
          <Carousel.Item key={movie.id}>
            <img
              className="d-block w-100"
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
            />
            <Carousel.Caption>
              <h3>{movie.title}</h3>
              <p>{movie.overview.slice(0, 100)}...</p>  {/* Teaser singkat */}
              <p><strong>Release Date:</strong> {movie.release_date}</p>  {/* Tanggal Rilis */}
              <p><strong>Duration:</strong> {movie.runtime} min</p>  {/* Durasi */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default RecentCarousel;
