import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';
import Search from '../components/Search/Search';
import FilterModal from '../components/FilterModal';
import axios from 'axios';

const Home = () => {
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterParams, setFilterParams] = useState({ year: '', rating: '', genres: [] });

  // Fungsi untuk menerima nilai dari FilterModal dan menyimpan ke state
  const handleApplyFilter = (filterValues) => {
    setFilterParams(filterValues);  // Update parameter filter dengan yang baru
  };

  // Fetch filtered movies dari API TMDB ketika filter berubah
  useEffect(() => {
    const fetchFilteredMovies = async () => {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&sort_by=popularity.desc`;
      
      if (filterParams.year) {
        url += `&primary_release_year=${filterParams.year}`;
      }
      if (filterParams.rating) {
        url += `&vote_average.gte=${filterParams.rating}`;
      }
      if (filterParams.genres.length > 0) {
        url += `&with_genres=${filterParams.genres.join(',')}`;
      }

      try {
        const response = await axios.get(url);
        setFilteredMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching filtered movies", error);
      }
    };

    fetchFilteredMovies();
  }, [filterParams]);

  return (
    <>
      <Container maxWidth="lg">
        <Box my={4}>
          <Search />
        </Box>

        <Box my={4}>
          <RecentCarousel />
        </Box>

        {/* Filter Modal */}
        <FilterModal onApply={handleApplyFilter} />  {/* Pastikan fungsi diteruskan */}

        {/* Tampilkan film yang difilter */}
        {filteredMovies.length > 0 ? (
          <Box my={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Filtered Movies
            </Typography>
            <Movie movies={filteredMovies} /> {/* Tampilkan film yang difilter */}
          </Box>
        ) : (
          <>
            <Box my={4}>
              <Typography variant="h4" component="h2" gutterBottom>
                Popular Movies
              </Typography>
              <Movie category="popular" />
            </Box>
            <Box my={4}>
              <Typography variant="h4" component="h2" gutterBottom>
                Recent Movies
              </Typography>
              <Movie category="recent" />
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
