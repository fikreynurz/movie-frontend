import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import Movie from '../components/Movie/Movie';
import axios from 'axios';

const CatPopularMovie = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);  // Loading state untuk popular movies
  const [currentPage, setCurrentPage] = useState(1);  // Tambahkan state untuk halaman saat ini
  const [totalPages, setTotalPages] = useState(1);    // Tambahkan state untuk total halaman

  // Fetch popular movies berdasarkan halaman
  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoadingPopular(true);  // Set loading jadi true saat mulai fetch data popular
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/popular`
        );
        setPopularMovies(response.data); // Tampilkan semua film
        setTotalPages(response.data.total_pages); // Simpan total halaman dari API
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoadingPopular(false);  // Set loading jadi false setelah fetch data selesai
      }
    };

    fetchPopularMovies();
  }, [currentPage]);  // Refetch data ketika halaman berubah

  // Fungsi untuk mengubah halaman
  const handlePageChange = (event, value) => {
    setCurrentPage(value);  // Update halaman saat ini
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
                  flexGrow: 1,        // Membiarkan box mengambil ruang yang tersedia
                  minWidth: '200px',   // Ukuran minimal box
                  maxWidth: '250px',   // Ukuran maksimal box
                  margin: '10px',      // Margin antar box
                }}>
                  <Movie movies={[movie]} />
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages}         // Total halaman
                page={currentPage}         // Halaman saat ini
                onChange={handlePageChange}  // Fungsi ketika halaman diubah
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
