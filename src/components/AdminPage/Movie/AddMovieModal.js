// AddMovieModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../../Api";

const AddMovieModal = ({ open, handleClose, fetchMovies }) => {
  const [newMovie, setNewMovie] = useState({
    title: "",
    original_title: "",
    overview: "",
    release_date: "",
    adult: false,
    video: false,
    genre_ids: [],
    category: [],
    production_countries: [{ alias: "", english_name: "", native_name: "" }],
    popularity: 0,
    original_language: "en",
    vote_average: 0,
    vote_count: 0,
    poster: null,
    backdrop: null,
  });

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get("/genres"); // Sesuaikan route ini jika berbeda
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
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

  const handleGenreChange = (genreId) => {
    setNewMovie((prev) => ({
      ...prev,
      genre_ids: prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter((id) => id !== genreId)
        : [...prev.genre_ids, genreId],
    }));
  };

  const handleCategoryChange = (category) => {
    setNewMovie((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((cat) => cat !== category)
        : [...prev.category, category],
    }));
  };

  const handleCountryChange = (index, field, value) => {
    const updatedCountries = [...newMovie.production_countries];
    updatedCountries[index] = { ...updatedCountries[index], [field]: value };
    setNewMovie((prev) => ({ ...prev, production_countries: updatedCountries }));
  };

  const handleAddMovie = async () => {
    const formData = new FormData();
    Object.keys(newMovie).forEach((key) => {
      if ((key === "poster" || key === "backdrop") && newMovie[key] !== null) {
        formData.append(key, newMovie[key]);
      } else if (Array.isArray(newMovie[key])) {
        formData.append(key, JSON.stringify(newMovie[key]));
      } else {
        formData.append(key, newMovie[key]);
      }
    });

    try {
      await api.post("/movies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMovies();
      handleClose();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, backgroundColor: "rgba(0, 21, 41, 0.85)", maxWidth: 600, margin: "auto", mt: "10%" }}>
        <Typography variant="h6" gutterBottom>
          Add New Movie
        </Typography>
        <Box sx={{ maxHeight: "65vh", overflowY: "auto", pr: 2 }}>
          <TextField label="Title" name="title" variant="outlined" fullWidth margin="normal" value={newMovie.title} onChange={handleInputChange} />
          <TextField label="Original Title" name="original_title" variant="outlined" fullWidth margin="normal" value={newMovie.original_title} onChange={handleInputChange} />

          <FormControl fullWidth margin="normal">
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload Poster
              <input type="file" name="poster" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload Backdrop
              <input type="file" name="backdrop" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
          </FormControl>

          <TextField label="Overview" name="overview" variant="outlined" fullWidth margin="normal" multiline rows={3} value={newMovie.overview} onChange={handleInputChange} />
          <TextField label="Popularity" name="popularity" variant="outlined" fullWidth margin="normal" type="number" value={newMovie.popularity} onChange={handleInputChange} />
          <TextField label="Release Date" name="release_date" variant="outlined" fullWidth margin="normal" type="date" value={newMovie.release_date} onChange={handleInputChange} />

          <TextField label="Original Language" name="original_language" variant="outlined" fullWidth margin="normal" value={newMovie.original_language} onChange={handleInputChange} />
          <TextField label="Vote Average" name="vote_average" variant="outlined" fullWidth margin="normal" type="number" value={newMovie.vote_average} onChange={handleInputChange} />
          <TextField label="Vote Count" name="vote_count" variant="outlined" fullWidth margin="normal" type="number" value={newMovie.vote_count} onChange={handleInputChange} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Adult</InputLabel>
            <Select name="adult" value={newMovie.adult} onChange={(e) => setNewMovie((prev) => ({ ...prev, adult: e.target.value }))}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Video</InputLabel>
            <Select name="video" value={newMovie.video} onChange={(e) => setNewMovie((prev) => ({ ...prev, video: e.target.value }))}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1" gutterBottom>Genres</Typography>
          {genres.map((genre) => (
            <FormControlLabel
              key={genre.id}
              control={
                <Checkbox
                  checked={newMovie.genre_ids.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  name="genre_ids"
                />
              }
              label={genre.name}
            />
          ))}

          <Typography variant="subtitle1" gutterBottom>Categories</Typography>
          {["Recent", "Popular"].map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={newMovie.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  name="category"
                />
              }
              label={category}
            />
          ))}

          <Typography variant="subtitle1" gutterBottom>Production Countries</Typography>
          {newMovie.production_countries.map((country, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField label="Alias" fullWidth value={country.alias} onChange={(e) => handleCountryChange(index, "alias", e.target.value)} />
              <TextField label="English Name" fullWidth value={country.english_name} onChange={(e) => handleCountryChange(index, "english_name", e.target.value)} />
              <TextField label="Native Name" fullWidth value={country.native_name} onChange={(e) => handleCountryChange(index, "native_name", e.target.value)} />
            </Box>
          ))}

          <Button variant="contained" color="primary" onClick={handleAddMovie}>Submit</Button>
          <Button onClick={handleClose} sx={{ ml: 2 }}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddMovieModal;
