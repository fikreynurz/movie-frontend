// AddMovieModal.js
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleCountryChange = (index, field, value) => {
    const updatedCountries = [...newMovie.production_countries];
    updatedCountries[index] = { ...updatedCountries[index], [field]: value };
    setNewMovie((prev) => ({ ...prev, production_countries: updatedCountries }));
  };

  const handleAddMovie = async () => {
    const formData = new FormData();
    Object.keys(newMovie).forEach((key) => {
      if (key === "backdrop" || key === "poster") {
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
            <InputLabel>Backdrop Image</InputLabel>
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload
              <input type="file" name="backdrop" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Poster Image</InputLabel>
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
              Upload
              <input type="file" name="poster" hidden onChange={handleFileChange} accept="image/*" />
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
            <Select name="adult" value={newMovie.adult} onChange={handleInputChange}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Video</InputLabel>
            <Select name="video" value={newMovie.video} onChange={handleInputChange}>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Genre IDs" name="genre_ids" variant="outlined" fullWidth margin="normal" placeholder="Comma-separated e.g. 28,14,35" value={newMovie.genre_ids.join(",")} onChange={(e) => setNewMovie({ ...newMovie, genre_ids: e.target.value.split(",").map(Number) })} />
          <TextField label="Categories" name="category" variant="outlined" fullWidth margin="normal" placeholder="Comma-separated" value={newMovie.category.join(",")} onChange={(e) => setNewMovie({ ...newMovie, category: e.target.value.split(",") })} />

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
