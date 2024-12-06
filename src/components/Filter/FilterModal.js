import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, Checkbox, FormControlLabel, Grid, MenuItem, Rating, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../Api';

const FilterModal = () => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState(0);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch genre data
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get(`/genres`);
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get(`/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  // Handle genre selection
  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    const genreId = Number(value); // Convert value to number
    setSelectedGenres((prev) =>
      checked ? [...prev, genreId] : prev.filter((genre) => genre !== genreId)
    );
  };

  const handleApply = () => {
    const ratingValue = rating ? rating * 2 : 0; // Convert stars to scale 1-10

    if (selectedGenres.length > 0 || year || ratingValue || selectedCountry) {
      navigate('/filter-results', {
        state: {
          year,
          rating: ratingValue,
          genres: selectedGenres,
          country: selectedCountry,
        },
      });
    }
    handleClose();
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Filter
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Filter Movies
          </Typography>

          {/* Genre Checkboxes */}
          <Typography variant="body1" gutterBottom>
            Genre
          </Typography>
          <Grid container>
            {genres.map((genre) => (
              <Grid item xs={6} key={genre.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={genre.id}
                      checked={selectedGenres.includes(genre.id)} // Maintain checked state
                      onChange={handleGenreChange}
                    />
                  }
                  label={genre.name}
                />
              </Grid>
            ))}
          </Grid>

          {/* Year Input */}
          <TextField
            label="Year"
            type="number"
            fullWidth
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* Rating Input */}
          <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
            Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={0.5}
          />

          {/* Country Selector */}
          <TextField
            label="Country"
            select
            fullWidth
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.alias} value={country.alias}>
                {country.english_name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApply}
            sx={{ mt: 3 }}
          >
            Apply Filter
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FilterModal;
