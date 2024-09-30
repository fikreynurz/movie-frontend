import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import Movie from '../components/Movie/Movie';
import axios from 'axios';

const CatRecentMovie = () => {
  const [recentMovies, setRecentMovies] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);  // Loading state untuk recent movies
  const [currentPage, setCurrentPage] = useState(1);  // Tambahkan state untuk halaman saat ini
  const [totalPages, setTotalPages] = useState(1);    // Tambahkan state untuk total halaman

  // Fetch recent movies berdasarkan halaman
  useEffect(() => {
    const fetchRecentMovies = async () => {
      setLoadingRecent(true);  // Set loading jadi true saat mulai fetch data recent
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=${currentPage}`
        );
        setRecentMovies(response.data.results); // Tampilkan semua film
        setTotalPages(response.data.total_pages); // Simpan total halaman dari API
      } catch (error) {
        console.error("Error fetching recent movies:", error);
      } finally {
        setLoadingRecent(false);  // Set loading jadi false setelah fetch data selesai
      }
    };

    fetchRecentMovies();
  }, [currentPage]);  // Refetch data ketika halaman berubah

  // Fungsi untuk mengubah halaman
  const handlePageChange = (event, value) => {
    setCurrentPage(value);  // Update halaman saat ini
  };

  return (
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

export default CatRecentMovie;
