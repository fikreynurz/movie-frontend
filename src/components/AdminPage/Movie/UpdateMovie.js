import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../Api';

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [popularity, setPopularity] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await api.get(`/movies/${id}`);
      const movie = response.data;
      setTitle(movie.title);
      setReleaseDate(movie.release_date);
      setPopularity(movie.popularity);
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMovie = { title, release_date: releaseDate, popularity };
    await api.put(`/movies/${id}`, updatedMovie);
    navigate('/movies');
  };

  return (
    <Container>
      <Typography variant="h4">Update Movie</Typography>
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
        <Button type="submit" variant="contained" color="primary">Update Movie</Button>
      </form>
    </Container>
  );
};

export default UpdateMovie;
