import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Movie from '../components/Movie/Movie';
import RecentCarousel from '../components/Carousel/Carousel';
import Search from '../components/Search/Search';
import FilterModal from '../components/FilterModal';
import axios from 'axios';
import recentMovies from '../components/RecentMovie/RecentMovie';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
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

  // Fetch Popular and Recent movies
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`
        );
        setPopularMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };

    const fetchRecentMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&page=1`
        );
        setRecentMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching recent movies:", error);
      }
    };

    fetchPopularMovies();
    fetchRecentMovies();
  }, []);

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
              <Movie movies={popularMovies} />  {/* Tampilkan Popular Movies */}
            </Box>
            <Box my={4}>
              <Typography variant="h4" component="h2" gutterBottom>
                Recent Movies
              </Typography>
              <Movie movies={recentMovies} />  {/* Tampilkan Recent Movies */}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
