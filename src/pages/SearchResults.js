import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography, Card, CardMedia, CardContent, Button, Box, Pagination, CircularProgress } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import api from "../components/Api"

const SearchResults = () => {
  const location = useLocation();
  const query = location.state?.query || '';

  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);
  const [moviePage, setMoviePage] = useState(1);
  const [actorPage, setActorPage] = useState(1);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [actorTotalPages, setActorTotalPages] = useState(1);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingActors, setLoadingActors] = useState(false);

  useEffect(() => {
    const fetchMovieResults = async () => {
      setLoadingMovies(true);
      try {
        const movieResponse = await api.get(`/movies/search?query=${query}&page=${moviePage}`);       
        setMovies(movieResponse.data.results.slice(0, 10));  // Batasi hasil ke 10 movie
        setMovieTotalPages(movieResponse.data.total_pages);
      } catch (error) {
        console.error('Error fetching movie results:', error);
      } finally {
        setLoadingMovies(false);
      }
    };
    if (query) fetchMovieResults();
  }, [query, moviePage]);

  useEffect(() => {
    const fetchActorResults = async () => {
      setLoadingActors(true);
      try {
        const actorResponse = await api.get(`/casts/search?query=${query}`);
        // Karena aktor ada di dalam array 'cast' dari objek Cast, kita harus memetakan array cast ini
        const actorsData = actorResponse.data.flatMap(castObj => castObj.cast); 
        setActors(actorsData.slice(0, 10));  // Batasi hasil ke 10 actor
        setActorTotalPages(1);  // Jika tidak ada pagination, kita set total pages menjadi 1
      } catch (error) {
        console.error('Error fetching actor results:', error);
      } finally {
        setLoadingActors(false);
      }
    };
  
    if (query) fetchActorResults();
  }, [query, actorPage]);
  

  const handleMoviePageChange = (event, value) => {
    setMoviePage(value);
  };

  const handleActorPageChange = (event, value) => {
    setActorPage(value);
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Search Results for "{query}"
      </Typography>

      {/* Movie Results */}
      {loadingMovies ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : movies.length > 0 && (
        <div>
          <Typography variant="h5" component="h3" gutterBottom>
            Movies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {movies.map((movie) => (
              <Box key={movie.id} sx={{
                flexGrow: 1,        
                minWidth: '200px',  
                maxWidth: '250px',  
                margin: '10px',    
              }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
                  <CardMedia
                    component="img"
                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={movie.title}
                    sx={{ height: 350, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {movie.release_date}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/movie/${movie.id}`}
                    sx={{ width: '100%', marginTop: 'auto' }}
                  >
                    View Details
                  </Button>
                </Card>
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={movieTotalPages}
              page={moviePage}
              onChange={handleMoviePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </div>
      )}

      {/* Actor Results */}
      {loadingActors ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : actors.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Actors
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {actors.map((actor) => (
            <Box key={actor.id} sx={{
              flexGrow: 1,
              minWidth: '200px',
              maxWidth: '250px',
              margin: '10px',
            }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  image={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={actor.name}
                  sx={{ height: 350, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Character: {actor.character}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/actor/${actor.id}`}
                  sx={{ width: '100%', marginTop: 'auto' }}
                >
                  View Details
                </Button>
              </Card>
            </Box>
          ))}
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={actorTotalPages}
              page={actorPage}
              onChange={handleActorPageChange}
              color="primary"
              size="large"
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
