import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Card, CardMedia, CardContent, Button, Box, Pagination, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const FilterResults = () => {
  const location = useLocation();
  const { year, rating, genres } = location.state || {};
  
  // States for filtered movies, pagination, total pages, and loading
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);  // Current page
  const [totalPages, setTotalPages] = useState(1);  // Total pages from API
  const [loading, setLoading] = useState(false);  // State for loading

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);  // Set loading to true before fetching data

      let url = `https://api.themoviedb.org/3/discover/movie?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&sort_by=popularity.desc&page=${page}`;  // Add page to URL
      
      // Add year filter
      if (year) {
        url += `&primary_release_year=${year}`;
      }
  
      // Add rating filter
      if (rating) {
        url += `&vote_average.gte=${rating}`;
      }
  
      // Add genre filter
      if (genres && genres.length > 0) {
        url += `&with_genres=${genres.join(',')}`;
      }
  
      try {
        const response = await axios.get(url);
        setFilteredMovies(response.data.results);
        setTotalPages(response.data.total_pages);  // Set the total pages from the API response
      } catch (error) {
        console.error("Error fetching filtered movies", error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchFilteredMovies();
  }, [year, rating, genres, page]);  // Add `page` as a dependency to refetch data when the page changes

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);  // Update the current page
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Filter Results
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : filteredMovies.length === 0 ? (
        <Typography variant="h5">No movies found matching the filter criteria.</Typography>
      ) : (
        <>
          <Grid container spacing={4} style={{ marginTop: '20px' }}>
            {filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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

          {/* Pagination Component */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}  // Total pages from API
              page={page}         // Current page
              onChange={handlePageChange}  // Change page handler
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default FilterResults;
