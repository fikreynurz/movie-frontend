import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  FormGroup,
  FormLabel,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Api';

const EditMoviePage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
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
    backdrop_path: '',
    poster_path: '',
    addedBy: '',
  });  
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchMovieData();
    fetchAvailableGenres();
  }, []);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/movies/${movieId}`);
      console.log(response.data); // Debugging: Periksa data yang dikembalikan API
      setMovieData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setLoading(false);
    }
  };
  

  const fetchAvailableGenres = async () => {
    try {
      const response = await api.get('/genres');
      setAvailableGenres(response.data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
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
    setLoading(true);
    try {
      await api.put(`/movies/${movieId}`, movieData);
      setLoading(false);
      setSnackbarMessage('Movie successfully updated!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/admin/movie');
    } catch (error) {
      setLoading(false);
      setSnackbarMessage('Failed to update movie. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error updating movie:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>Edit Movie</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Title */}
          <TextField
            label="Title"
            name="title"
            value={movieData.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          {/* Original Title */}
          <TextField
            label="Original Title"
            name="original_title"
            value={movieData.original_title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          {/* Overview */}
          <TextField
            label="Overview"
            name="overview"
            value={movieData.overview}
            onChange={handleInputChange}
            multiline
            fullWidth
            margin="normal"
            minRows={1} // Jumlah baris minimum
            maxRows={15} // Jumlah baris maksimum
          />

          {/* Release Date */}
          <TextField
            label="Release Date"
            name="release_date"
            type="date"
            value={movieData.release_date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Categories</FormLabel>
            <FormGroup row>
              {['popular', 'recent', 'upcoming'].map((cat) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={movieData.category.includes(cat)}
                      onChange={() => handleCheckboxChange('category', cat)}
                    />
                  }
                  label={cat}
                  key={cat}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Genre Checkbox Group */}
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Genres</FormLabel>
            <FormGroup row>
              {availableGenres.map((genre) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={movieData.genre_ids.includes(genre.id)}
                      onChange={() => handleCheckboxChange('genre_ids', genre.id)}
                      name="genre_ids"
                    />
                  }
                  label={genre.name}
                  key={genre.id}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Switches for adult, video, and isApproved */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <FormControlLabel
              control={<Switch checked={movieData.adult} onChange={handleSwitchChange} name="adult" />}
              label="Adult"
            />
            <FormControlLabel
              control={<Switch checked={movieData.video} onChange={handleSwitchChange} name="video" />}
              label="Video"
            />
            <FormControlLabel
              control={<Switch checked={movieData.isApproved} onChange={handleSwitchChange} name="isApproved" />}
              label="Approved"
            />
          </Box>
          
          {/* Production Countries Section */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Production Countries
            </Typography>
            {movieData.production_countries.map((country, index) => (
              <Grid container spacing={2} key={index} sx={{ mt: 2, p: 2}}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Alias"
                    value={country.alias}
                    fullWidth
                    onChange={(e) => {
                      const updatedCountries = [...movieData.production_countries];
                      updatedCountries[index].alias = e.target.value;
                      setMovieData((prev) => ({ ...prev, production_countries: updatedCountries }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="English Name"
                    value={country.english_name}
                    fullWidth
                    onChange={(e) => {
                      const updatedCountries = [...movieData.production_countries];
                      updatedCountries[index].english_name = e.target.value;
                      setMovieData((prev) => ({ ...prev, production_countries: updatedCountries }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Native Name"
                    value={country.native_name}
                    fullWidth
                    onChange={(e) => {
                      const updatedCountries = [...movieData.production_countries];
                      updatedCountries[index].native_name = e.target.value;
                      setMovieData((prev) => ({ ...prev, production_countries: updatedCountries }));
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>

          {/* Save and Cancel Buttons */}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={() => setOpenModal(true)} variant="contained" color="primary">
            Save
          </Button>
            <Button onClick={() => navigate('/admin/movie')} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>

                {/* Modal Konfirmasi */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to update this movie?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              No
            </Button>
            <Button onClick={handleSave} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        </>
      )}

      {/* Snackbar Notifikasi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default EditMoviePage;
