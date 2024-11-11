// EditMovieModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Switch, FormControlLabel, FormControl, FormGroup, FormLabel, Checkbox, FormHelperText } from '@mui/material';
import api from '../../Api';

const EditMovieModal = ({ open, handleClose, movieId, fetchMovies }) => {
  const [movieData, setMovieData] = useState({
    title: '',
    original_title: '',
    overview: '',
    release_date: '',
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
    original_language: '',
    genre_ids: [],
    adult: false,
    video: false,
    isApproved: false,
    category: [],
    production_countries: [],
    cast: []
  });
  
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableCategories, setAvailableCategories] = useState(["Action", "Drama", "Comedy", "Horror"]); // misalnya kategori default
  const [availableCast, setAvailableCast] = useState([]);
  
  useEffect(() => {
    if (open && movieId) {
      fetchMovieData();
      fetchAvailableData();
      fetchAvailableGenres();
    }
  }, [open, movieId]);

  const fetchMovieData = async () => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      setMovieData(response.data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };  
  const fetchAvailableData = async () => {
    try {
      const genresResponse = await api.get('/genres'); // Pastikan endpoint ini benar
      setAvailableGenres(genresResponse.data);
    } catch (error) {
      console.error('Error fetching available genres:', error);
    }
  };  

  const fetchAvailableGenres = async () => {
    try {
      const response = await api.get('/genres');
      console.log('Genres data:', response.data); // Log data untuk memastikan strukturnya
      const genres = Array.isArray(response.data) ? response.data : [];
      setAvailableGenres(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setAvailableGenres([]);
    }
  };   

  const handleGenreCheckboxChange = (genreId) => {
    setMovieData((prev) => {
      const updatedGenres = prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter((id) => id !== genreId)
        : [...prev.genre_ids, genreId];
      return { ...prev, genre_ids: updatedGenres };
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCheckboxChange = (type, id) => {
    setMovieData((prev) => {
      const updatedArray = prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id];
      return { ...prev, [type]: updatedArray };
    });
  };  

  const handleSave = async () => {
    try {
      await api.put(`/movies/${movieId}`, movieData);
      fetchMovies();
      handleClose();
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "#1c1f26",
          color: "#fff",
          maxWidth: 500,
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: 2,
          margin: "auto",
          mt: "10%",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Movie
        </Typography>

        <TextField
          label="Title"
          name="title"
          value={movieData.title}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          sx={{ backgroundColor: "#303846", borderRadius: 1 }}
          InputLabelProps={{ style: { color: "#aab0b7" } }}
        />
        <TextField
          label="Original Title"
          name="original_title"
          value={movieData.original_title}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          sx={{ backgroundColor: "#303846", borderRadius: 1 }}
          InputLabelProps={{ style: { color: "#aab0b7" } }}
        />
        <TextField
          label="Overview"
          name="overview"
          value={movieData.overview}
          onChange={handleInputChange}
          multiline
          rows={3}
          fullWidth
          margin="dense"
          sx={{ backgroundColor: "#303846", borderRadius: 1 }}
          InputLabelProps={{ style: { color: "#aab0b7" } }}
        />
        <TextField
          label="Release Date"
          name="release_date"
          type="date"
          value={movieData.release_date}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          sx={{ backgroundColor: "#303846", borderRadius: 1 }}
          InputLabelProps={{
            shrink: true,
            style: { color: "#aab0b7" },
          }}
        />

        {/* Genre Checkbox Group */}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Genres</FormLabel>
          <FormGroup row>
            {availableGenres.length > 0 ? (
              availableGenres.map((genre) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={movieData.genre_ids.includes(genre.id)}
                      onChange={() => handleCheckboxChange("genre_ids", genre.id)}
                      name="genre_ids"
                    />
                  }
                  label={genre.name}
                  key={genre.id}
                />
              ))
            ) : (
              <Typography variant="body2">No genres available</Typography>
            )}
          </FormGroup>
        </FormControl>

        {/* Switches for adult, video, and isApproved */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <FormControlLabel
            control={<Switch checked={movieData.adult} onChange={handleSwitchChange} name="adult" />}
            label="Adult"
            sx={{ color: "#aab0b7" }}
          />
          <FormControlLabel
            control={<Switch checked={movieData.video} onChange={handleSwitchChange} name="video" />}
            label="Video"
            sx={{ color: "#aab0b7" }}
          />
          <FormControlLabel
            control={<Switch checked={movieData.isApproved} onChange={handleSwitchChange} name="isApproved" />}
            label="Approved"
            sx={{ color: "#aab0b7" }}
          />
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditMovieModal;
