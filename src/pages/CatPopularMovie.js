import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import Movie from '../components/Movie/Movie';
import axios from 'axios';

const CatPopularMovie = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);  
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [totalPages, setTotalPages] = useState(1);    // State for total pages

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);  // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/popular?page=${currentPage}&limit=10`  // Send page and limit
        );
        setPopularMovies(response.data.results);
        setTotalPages(response.data.total_pages);  // Set total pages based on response
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoadingPopular(false);  // Set loading to false after data is fetched
      }
    };

    fetchPopularMovies();
  }, [currentPage]);  // Refetch when the page changes

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);  // Update the current page
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Popular Movies
        </Typography>

        {loadingPopular ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {popularMovies.map((movie) => (
                <Box key={movie.id} sx={{
                  flexGrow: 1,        
                  minWidth: '200px',  
                  maxWidth: '250px',  
                  margin: '10px',     
                }}>
                  <Movie movies={[movie]} />
                </Box>
              ))}
            </Box>

            {/* Pagination component */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}        // Total pages
                page={currentPage}        // Current page
                onChange={handlePageChange}  // Handle page change
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CatPopularMovie;
