import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import api from '../../Api';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [popularity, setPopularity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMovie = { title, release_date: releaseDate, popularity };
    await api.post('/movies', newMovie);
    setTitle('');
    setReleaseDate('');
    setPopularity('');
  };

  return (
    <Container>
      <Typography variant="h4">Add New Movie</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Release Date"
          fullWidth
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Popularity"
          fullWidth
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">Add Movie</Button>
      </form>
    </Container>
  );
};

export default AddMovie;
