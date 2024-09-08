import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Science Fiction' },
];

const releaseYears = [
  '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'
];

const ratings = [
  { label: '1+', value: 1 },
  { label: '3+', value: 3 },
  { label: '5+', value: 5 },
  { label: '7+', value: 7 },
  { label: '9+', value: 9 }
];

const FilterMovies = () => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYears((prevYears) =>
      prevYears.includes(year)
        ? prevYears.filter((y) => y !== year)
        : [...prevYears, year]
    );
  };

  const handleRatingChange = (event) => {
    const rating = event.target.value;
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(rating)
        ? prevRatings.filter((r) => r !== rating)
        : [...prevRatings, rating]
    );
  };

  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
  };

  const applyFilters = () => {
    navigate('/filtered-movies', {
      state: {
        selectedYears,
        selectedRatings,
        selectedGenres,
      },
    });
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f7f7f7', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Filter Movies
      </Typography>

      <FormGroup>
        {/* Filter by Release Year */}
        <Typography variant="body1" gutterBottom>
          Release Year
        </Typography>
        {releaseYears.map((year) => (
          <FormControlLabel
            key={year}
            control={
              <Checkbox
                checked={selectedYears.includes(year)}
                onChange={handleYearChange}
                value={year}
              />
            }
            label={year}
          />
        ))}

        {/* Filter by Rating */}
        <Typography variant="body1" gutterBottom>
          Rating
        </Typography>
        {ratings.map((rating) => (
          <FormControlLabel
            key={rating.value}
            control={
              <Checkbox
                checked={selectedRatings.includes(rating.value.toString())}
                onChange={handleRatingChange}
                value={rating.value.toString()}
              />
            }
            label={rating.label}
          />
        ))}

        {/* Filter by Genre */}
        <Typography variant="body1" gutterBottom>
          Genre
        </Typography>
        {genres.map((genre) => (
          <FormControlLabel
            key={genre.id}
            control={
              <Checkbox
                checked={selectedGenres.includes(genre.id.toString())}
                onChange={handleGenreChange}
                value={genre.id.toString()}
              />
            }
            label={genre.name}
          />
        ))}
      </FormGroup>

      {/* Button to Apply Filters */}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterMovies;
