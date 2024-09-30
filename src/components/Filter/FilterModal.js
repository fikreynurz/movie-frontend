import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, Checkbox, FormControlLabel, Grid, MenuItem, Rating, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Tambahkan useNavigate untuk routing

const FilterModal = () => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState(0);  // Ubah menjadi state untuk Rating (bintang)
  const [countries, setCountries] = useState([]);  
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch genre data dari API TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          // `https://api.themoviedb.org/3/genre/movie/list?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US`
          `http://localhost:5000/api/genres`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch countries data from TMDb API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          // `https://api.themoviedb.org/3/configuration/countries?api_key=ac18a0e6818325589a5c34b35da509ab`
          `http://localhost:5000/api/countries`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  // Ketika genre diubah
  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedGenres(prev =>
      checked ? [...prev, value] : prev.filter(genre => genre !== value)
    );
  };

  // Function untuk apply filter
  const handleApply = () => {
    if (selectedGenres.length > 0 || year || rating || selectedCountry) {
      navigate('/filter-results', { state: { year, rating, genres: selectedGenres, country: selectedCountry } });
    }
    handleClose();
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Filter
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Movies
          </Typography>

          {/* Checkbox untuk Genre */}
          <Typography variant="body1" gutterBottom>Genre</Typography>
          <Grid container>
            {genres.map(genre => (
              <Grid item xs={6} key={genre.id}>
                <FormControlLabel
                  control={<Checkbox value={genre.id} onChange={handleGenreChange} />}
                  label={genre.name}
                />
              </Grid>
            ))}
          </Grid>

          {/* Input Tahun */}
          <TextField
            label="Year"
            type="number"
            fullWidth
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* Input Rating dalam bentuk Bintang */}
          <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
            Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}  // Update rating berdasarkan input bintang
            precision={0.5}
          />

          {/* Select Negara */}
          <TextField
            label="Country"
            select
            fullWidth
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">
              None
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.iso_3166_1} value={country.iso_3166_1}>
                {country.english_name}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" color="primary" fullWidth onClick={handleApply} sx={{ mt: 3 }}>
            Apply Filter
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FilterModal;
