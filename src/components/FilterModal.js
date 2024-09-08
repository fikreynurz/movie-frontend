import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, Checkbox, FormControlLabel, TextField, Grid } from '@mui/material';
import axios from 'axios';

const FilterModal = ({ onApply }) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch genre data dari API TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US`);
        setGenres(response.data.genres);
        console.log("Fetched genres:", response.data.genres); // Debugging log genre yang difetch
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };
    fetchGenres();
  }, []);

  // Ketika genre diubah
  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedGenres(prev =>
      checked ? [...prev, value] : prev.filter(genre => genre !== value)
    );
    console.log("Selected genres:", selectedGenres); // Debugging log genre yang dipilih
  };

  // Ketika user apply filter
  const handleApply = () => {
    console.log("Applying filter with:", {
      year,
      rating,
      genres: selectedGenres
    });  // Debugging log untuk nilai filter yang diterapkan

    if (typeof onApply === 'function') {
      onApply({
        year,
        rating,
        genres: selectedGenres
      });
    } else {
      console.error('onApply is not a function');
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

          {/* Input Rating */}
          <TextField
            label="Rating"
            type="number"
            fullWidth
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleApply} sx={{ mt: 3 }}>
            Apply Filter
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FilterModal;
