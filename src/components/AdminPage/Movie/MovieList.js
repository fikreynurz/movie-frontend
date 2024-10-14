import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await axios.get('/api/movies');
    setMovies(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/movies/${id}`);
    setMovies(movies.filter(movie => movie.id !== id));
    setOpen(false);
  };

  const handleClickOpen = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Release Date</TableCell>
            <TableCell>Popularity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.release_date}</TableCell>
              <TableCell>{movie.popularity}</TableCell>
              <TableCell>
                <IconButton onClick={() => navigate(`/movies/${movie.id}`)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => navigate(`/movies/update/${movie.id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleClickOpen(movie)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {selectedMovie?.title}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={() => handleDelete(selectedMovie.id)} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default MoviesList;
