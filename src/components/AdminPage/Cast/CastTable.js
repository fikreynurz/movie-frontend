import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminSidebar from '../AdminSidebar';
import api from '../../Api';

const CastTable = () => {
  const [casts, setCasts] = useState([]);
  const [movies, setMovies] = useState([]);
  const [uniqueCasts, setUniqueCasts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentCast, setCurrentCast] = useState({ movie_id: '', cast: [{ name: '', original_name: '', known_for_department: '', cast_id: '' }] });
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCasts();
    fetchMovies();
  }, []);

  const fetchCasts = async () => {
    try {
      const response = await api.get('/casts'); // Pastikan route ini sesuai dengan backend
      setCasts(response.data);
      aggregateCastsByMember(response.data);
    } catch (error) {
      console.error('Error fetching casts:', error);
    }
  };  

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const aggregateCastsByMember = (castsData) => {
    const castMap = new Map();
  
    castsData.forEach((movieCast) => {
      movieCast.cast.forEach((member) => {
        const key = `${member.name}-${member.cast_id}`;
        if (!castMap.has(key)) {
          castMap.set(key, {
            name: member.name,
            cast_id: member.cast_id,
            movies: [movieCast.movie_id]
          });
        } else {
          castMap.get(key).movies.push(movieCast.movie_id);
        }
      });
    });
  
    setUniqueCasts(Array.from(castMap.values()));
  };
  

  const handleDelete = async (movie_id, cast_id) => {
    try {
      await api.delete(`/casts/${movie_id}/${cast_id}`);
      fetchCasts();
    } catch (error) {
      console.error('Error deleting cast:', error);
    }
  };
  

  const handleOpenDialog = (cast = { movie_id: '', cast: [{ name: '', original_name: '', known_for_department: '', cast_id: '' }] }) => {
    setCurrentCast(cast);
    setEditMode(!!cast.movie_id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentCast({ movie_id: '', cast: [{ name: '', original_name: '', known_for_department: '', cast_id: '' }] });
  };

  const handleSaveCast = async () => {
    try {
      const castData = {
        movie_id: currentCast.movie_id,
        cast: currentCast.cast.map((castMember) => ({
          adult: castMember.adult || false,
          gender: castMember.gender || 0,
          id: castMember.id || Math.floor(Math.random() * 1000000),
          known_for_department: castMember.known_for_department || 'Acting',
          name: castMember.name,
          original_name: castMember.original_name || castMember.name,
          popularity: castMember.popularity || 0,
          profile_path: castMember.profile_path || '',
          character: castMember.character || '',
          credit_id: castMember.credit_id || '',
          order: castMember.order || 0,
        })),
      };
  
      let response;
      if (editMode) {
        response = await api.put(`/casts/${currentCast.movie_id}`, castData);
      } else {
        response = await api.post(`/casts/${currentCast.movie_id}`, castData); // Sertakan movie_id
      }
  
      fetchCasts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving cast:', error);
    }
  };

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...currentCast.cast];
    updatedCast[index] = { ...updatedCast[index], [field]: value };
    setCurrentCast({ ...currentCast, cast: updatedCast });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCasts = uniqueCasts.filter((cast) =>
    cast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCasts = filteredCasts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <AdminSidebar />
      <Box sx={{ margin: 'auto', width: '95%', padding: 2 }}>
        <Typography variant="h4" gutterBottom>Cast Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search by Cast Name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add Cast
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ margin: 'auto', width: '95%', boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <TableCell sx={{ color: '#fff' }}><strong>Cast Name</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Movies</strong></TableCell>
              <TableCell sx={{ color: '#fff' }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCasts.map((cast) => (
              <TableRow key={cast.name} hover>
                <TableCell>{cast.name}</TableCell>
                <TableCell>{cast.movies.join(', ')}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(cast)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(cast.movie[0],cast.cast_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCasts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Cast' : 'Add Cast'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Movie"
            fullWidth
            margin="dense"
            value={currentCast.movie_id}
            onChange={(e) => setCurrentCast({ ...currentCast, movie_id: e.target.value })}
            disabled={editMode}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>
          {/* Fields for additional cast data */}
          <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={currentCast.cast[0]?.name || ''}
              onChange={(e) => handleCastChange(0, 'name', e.target.value)}
          />
          <TextField
              margin="dense"
              label="Original Name"
              fullWidth
              value={currentCast.cast[0]?.original_name || ''}
              onChange={(e) => handleCastChange(0, 'original_name', e.target.value)}
          />
          <TextField
              margin="dense"
              label="Known for Department"
              fullWidth
              value={currentCast.cast[0]?.known_for_department || ''}
              onChange={(e) => handleCastChange(0, 'known_for_department', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveCast} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CastTable;