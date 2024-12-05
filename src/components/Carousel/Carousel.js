import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';  // Menggunakan Carousel dari React Bootstrap
import { Container } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../Api';

const RecentCarousel = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get(`/movies/upcoming`);
        setMovies(response.data);  // Ambil array 'results' dari respons API
      } catch (error) {
        console.error("Error fetching the recent movies", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Container>
      <Carousel>
        {movies.slice(0, 5).map((movie) => (
          <Carousel.Item key={movie.id}>
            <img
              className="d-block w-100"
              src={`https://backend-api.larasbasa.com/api/movies/backdrop/${movie.id}`}  
              alt={movie.title}
              style={{
                height: '500px',       // Atur tinggi gambar
                objectFit: 'cover',     // Menjaga proporsi gambar agar tidak terdistorsi
                borderRadius: '8px',    // Membuat gambar lebih halus dengan border-radius
              }}
            />
            <Carousel.Caption>
              <h3>{movie.title}</h3>
              <p>{movie.overview.slice(0, 100)}...</p> 
              <p><strong>Release Date:</strong> {movie.release_date}</p>  
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default RecentCarousel;
