import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';  // Menggunakan Carousel dari React Bootstrap
import { Container } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecentCarousel = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US`);
        setMovies(response.data.results);  // Ambil array 'results' dari respons API
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
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}  
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
