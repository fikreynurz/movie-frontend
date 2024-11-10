import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import axios from 'axios';
import {Typography, Card, CardMedia, CardContent, Button, Box, Pagination, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../components/Api';

const FilterResults = () => {
  const location = useLocation();
  const { year, rating, genres, country } = location.state || {};
  
  // States for filtered movies, pagination, total pages, and loading
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);  // Current page
  const [totalPages, setTotalPages] = useState(1);  // Total pages
  const [loading, setLoading] = useState(false);  // State for loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setLoading(true);
      let url = `/movies/filter?page=${page}`;
      if (year) url += `&year=${year}`;
      if (rating) url += `&rating=${rating}`;
      if (genres) url += `&genres=${genres.join(',')}`;
      if (country) url += `&country=${country}`;
  
      try {
          const response = await api.get(url);
          setFilteredMovies(response.data.results);
          setTotalPages(response.data.total_pages);
      } catch (error) {
          console.error("Error fetching filtered movies:", error);
      } finally {
          setLoading(false);
      }
  };
  
    fetchFilteredMovies();
  }, [year, rating, genres, country, page]);  // Add `page` as a dependency to refetch data when the page changes
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);  // Update the current page
  };

  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, pt: 2 }}>
    <Button
      color="inherit"
      size="small"
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  </Box>
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {filteredMovies.map((movie) => (
              <Box key={movie.id} sx={{
                flexGrow: 1,        
                minWidth: '200px',  
                maxWidth: '250px',  
                margin: '10px',    
              }}>
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
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </div>
    </>
  );
};

export default FilterResults;