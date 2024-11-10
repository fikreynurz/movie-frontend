import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import Movie from '../components/Movie/Movie';
//import axios from 'axios';
import api from '../components/Api';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CatRecentMovie = () => {
  const [recentMovies, setRecentMovies] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [totalPages, setTotalPages] = useState(1);    // State for total pages
  const navigate = useNavigate();

  // Fetch recent movies with pagination
  useEffect(() => {
    const fetchRecentMovies = async () => {
      setLoadingRecent(true);
      try {
          const response = await api.get(`/movies/recent?page=${currentPage}&limit=10`);
          setRecentMovies(response.data.results);
          setTotalPages(response.data.total_pages);
      } catch (error) {
          console.error("Error fetching recent movies:", error);
      } finally {
          setLoadingRecent(false);
      }
    };

    fetchRecentMovies();
  }, [currentPage]);  // Fetch new data whenever current page changes

  // Handle page change event
  const handlePageChange = (event, value) => {
    setCurrentPage(value);  // Update current page state
  };

  return (
    <>
    {/* Button "Back" di luar Container */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, pt: 2 }}>
      <Button
        color="inherit"
        size="small"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>

    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Recent Movies
        </Typography>

        {loadingRecent ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {recentMovies.map((movie) => (
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

            {/* Pagination for recent movies */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages}         // Total number of pages
                page={currentPage}         // Current page
                onChange={handlePageChange}  // Handle page change
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
    </>
  );
};

export default CatRecentMovie;
