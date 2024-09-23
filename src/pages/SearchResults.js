import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography, Card, CardMedia, CardContent, Button, Box, Pagination, CircularProgress } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const query = location.state?.query || '';

  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]);

  // Pagination states for movies and actors
  const [moviePage, setMoviePage] = useState(1);
  const [actorPage, setActorPage] = useState(1);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [actorTotalPages, setActorTotalPages] = useState(1);

  // Loading states
  const [loadingMovies, setLoadingMovies] = useState(false);  // State untuk loading movies
  const [loadingActors, setLoadingActors] = useState(false);  // State untuk loading actors

  // Fetch movies
  useEffect(() => {
    const fetchMovieResults = async () => {
      setLoadingMovies(true);  // Set loading menjadi true sebelum fetching movies

      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${query}&page=${moviePage}`
        );
        setMovies(movieResponse.data.results);
        setMovieTotalPages(movieResponse.data.total_pages);  // Set total pages for movies
      } catch (error) {
        console.error('Error fetching movie results:', error);
      } finally {
        setLoadingMovies(false);  // Set loading menjadi false setelah data diterima
      }
    };

    if (query) fetchMovieResults();
  }, [query, moviePage]);

  // Fetch actors
  useEffect(() => {
    const fetchActorResults = async () => {
      setLoadingActors(true);  // Set loading menjadi true sebelum fetching actors

      try {
        const actorResponse = await axios.get(
          `https://api.themoviedb.org/3/search/person?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&query=${query}&page=${actorPage}`
        );
        setActors(actorResponse.data.results);
        setActorTotalPages(actorResponse.data.total_pages);  // Set total pages for actors
      } catch (error) {
        console.error('Error fetching actor results:', error);
      } finally {
        setLoadingActors(false);  // Set loading menjadi false setelah data diterima
      }
    };

    if (query) fetchActorResults();
  }, [query, actorPage]);

  // Handlers for changing pages
  const handleMoviePageChange = (event, value) => {
    setMoviePage(value);  // Update current page for movies
  };

  const handleActorPageChange = (event, value) => {
    setActorPage(value);  // Update current page for actors
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
      ) : (
        movies.length > 0 && (
          <div>
            <Typography variant="h5" component="h3" gutterBottom>
              Movies
            </Typography>
            <Grid container spacing={4} style={{ marginTop: '20px' }}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
                </Grid>
              ))}
            </Grid>

            {/* Pagination for Movies */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={movieTotalPages}  // Total pages from API for movies
                page={moviePage}         // Current page for movies
                onChange={handleMoviePageChange}  // Change page handler
                color="primary"
                size="large"
              />
            </Box>
          </div>
        )
      )}

      {/* Actor Results */}
      {loadingActors ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        actors.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Actors
            </Typography>
            <Grid container spacing={4} style={{ marginTop: '20px' }}>
              {actors.map((actor) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id}>
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
                        Known for: {actor.known_for.map(movie => movie.title || movie.name).join(', ')}
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
                </Grid>
              ))}
            </Grid>

            {/* Pagination for Actors */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={actorTotalPages}  // Total pages from API for actors
                page={actorPage}         // Current page for actors
                onChange={handleActorPageChange}  // Change page handler
                color="primary"
                size="large"
              />
            </Box>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;
