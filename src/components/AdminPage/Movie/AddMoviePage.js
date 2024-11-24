import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  FormGroup
} from '@mui/material';
import api from '../../Api';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddMovieForm = () => {
  const [newMovie, setNewMovie] = useState({
    title: '',
    original_title: '',
    overview: '',
    release_date: '',
    adult: false,
    video: false,
    genre_ids: [],
    category: [],
    production_countries: [{ alias: "", english_name: "", native_name: "" }],
    popularity: 0,
    original_language: 'en',
    vote_average: 0,
    vote_count: 0,
    poster: null,
    backdrop: null,
  });
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const onDropPoster = (acceptedFiles) => {
    setNewMovie((prev) => ({ ...prev, poster: acceptedFiles[0] }));
  };
  
  const onDropBackdrop = (acceptedFiles) => {
    setNewMovie((prev) => ({ ...prev, backdrop: acceptedFiles[0] }));
  };

  const { getRootProps: getPosterRootProps, getInputProps: getPosterInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, 'poster'),
  });

  const { getRootProps: getBackdropRootProps, getInputProps: getBackdropInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, 'backdrop'),
  });

  const handleFileDrop = (acceptedFiles, type) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setNewMovie((prev) => ({ ...prev, [type]: file }));
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setNewMovie((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCheckboxChange = (name, value) => {
    setNewMovie((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleCountryChange = (index, field, value) => {
    const updatedCountries = [...newMovie.production_countries];
    updatedCountries[index] = { ...updatedCountries[index], [field]: value };
    setNewMovie((prev) => ({ ...prev, production_countries: updatedCountries }));
  };

  const handleAddMovie = async () => {
    setLoading(true);
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.role || 'user';
  
    Object.keys(newMovie).forEach((key) => {
      if (key === 'poster' || key === 'backdrop') {
        formData.append(key, newMovie[key]);
      } else if (key === 'popularity' || key === 'vote_average' || key === 'vote_count') {
        formData.append(key, newMovie[key]);
      } else if (typeof newMovie[key] === 'object') {
        formData.append(key, JSON.stringify(newMovie[key]));
      } else {
        formData.append(key, newMovie[key]);
      }
    });    
  
    formData.append('isApproved', userRole === 'admin');
  
    try {
      await api.post('/movies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      setOpenModal(false); // Tutup modal setelah berhasil
  
      // Tampilkan SweetAlert berhasil
      Swal.fire({
        title: 'Success!',
        text: 'Movie berhasil ditambahkan!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(-1); // Kembali ke halaman sebelumnya setelah notifikasi ditutup
      });
    } catch (error) {
      setLoading(false);
      setOpenModal(false); // Tutup modal jika ada error
  
      // Tampilkan SweetAlert gagal
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menambahkan movie. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding movie:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Tutup Snackbar
  };
    
  return (
    <>
    {/* Button "Back" di luar Container */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, pt: 2 }}>
      <Button
        color="inherit"
        size="small"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>

    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Movie
      </Typography>

      {/* Movie Details Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Movie Detailsn
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                variant="outlined"
                fullWidth
                required
                value={newMovie.title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Original Title"
                name="original_title"
                variant="outlined"
                fullWidth
                value={newMovie.original_title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Overview"
                name="overview"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={newMovie.overview}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Genres Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Genres
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormGroup row>
            {genres.map((genre) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newMovie.genre_ids.includes(genre.id)}
                    onChange={() => handleCheckboxChange("genre_ids", genre.id)}
                  />
                }
                label={genre.name}
                key={genre.id}
              />
            ))}
          </FormGroup>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormGroup row>
            {["popular", "recent", "upcoming"].map((cat) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newMovie.category.includes(cat)}
                    onChange={() => handleCheckboxChange("category", cat)}
                  />
                }
                label={cat}
                key={cat}
              />
            ))}
          </FormGroup>
        </CardContent>
      </Card>

      {/* Media Section with Dropzone */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Media
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <div {...getPosterRootProps()} style={{ border: '2px dashed #1976d2', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getPosterInputProps()} />
                {newMovie.poster ? (
                  <Typography variant="body2">Poster Uploaded: {newMovie.poster.name}</Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Drag & Drop Poster Here or Click to Upload
                  </Typography>
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div {...getBackdropRootProps()} style={{ border: '2px dashed #1976d2', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getBackdropInputProps()} />
                {newMovie.backdrop ? (
                  <Typography variant="body2">Backdrop Uploaded: {newMovie.backdrop.name}</Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Drag & Drop Backdrop Here or Click to Upload
                  </Typography>
                )}
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ratings Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ratings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Popularity"
                name="popularity"
                type="number"
                variant="outlined"
                fullWidth
                value={newMovie.popularity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Vote Average"
                name="vote_average"
                type="number"
                variant="outlined"
                fullWidth
                value={newMovie.vote_average}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Vote Count"
                name="vote_count"
                type="number"
                variant="outlined"
                fullWidth
                value={newMovie.vote_count}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Details Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Additional Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Original Language"
                name="original_language"
                variant="outlined"
                fullWidth
                value={newMovie.original_language}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Release Date"
                name="release_date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newMovie.release_date}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={newMovie.adult}
                onChange={(e) => setNewMovie({ ...newMovie, adult: e.target.checked })}
              />
            }
            label="Adult"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newMovie.video}
                onChange={(e) => setNewMovie({ ...newMovie, video: e.target.checked })}
              />
            }
            label="Video"
          />
        </CardContent>
      </Card>

      {/* Production Countries Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Production Countries
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {newMovie.production_countries.map((country, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={4}>
                <TextField
                  label="Alias"
                  fullWidth
                  value={country.alias}
                  onChange={(e) => handleCountryChange(index, "alias", e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="English Name"
                  fullWidth
                  value={country.english_name}
                  onChange={(e) => handleCountryChange(index, "english_name", e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Native Name"
                  fullWidth
                  value={country.native_name}
                  onChange={(e) => handleCountryChange(index, "native_name", e.target.value)}
                />
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ mt: 3, width: 200 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </Box>
    </Box>

          {/* Modal Konfirmasi */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Konfirmasi Tambah Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menambahkan movie ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Tidak
          </Button>
          <Button onClick={handleAddMovie} color="primary">
            Ya
          </Button>
        </DialogActions>
      </Dialog>

            {/* Snackbar untuk notifikasi */}
            <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
  </>
  );
};
export default AddMovieForm;
