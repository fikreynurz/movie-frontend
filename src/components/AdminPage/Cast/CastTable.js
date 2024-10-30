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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminSidebar from '../AdminSidebar';
import api from '../../Api';

const CastTable = () => {
  const [casts, setCasts] = useState([]);
  const [uniqueCasts, setUniqueCasts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentCast, setCurrentCast] = useState({ movie_id: '', cast: [] });
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCasts();
  }, []);

  const fetchCasts = async () => {
    try {
      const response = await api.get('/casts');
      setCasts(response.data);
      aggregateCastsByMember(response.data);
    } catch (error) {
      console.error('Error fetching casts:', error);
    }
  };

  const aggregateCastsByMember = (castsData) => {
    // Create a map to store unique cast members and their associated movies
    const castMap = new Map();

    castsData.forEach((movieCast) => {
      movieCast.cast.forEach((member) => {
        if (!castMap.has(member.name)) {
          // If the cast member is not in the map, add them with an array containing the movie ID
          castMap.set(member.name, { name: member.name, movies: [movieCast.movie_id] });
        } else {
          // If already present, just push the movie ID to their movies list
          castMap.get(member.name).movies.push(movieCast.movie_id);
        }
      });
    });

    // Convert the map values to an array and update uniqueCasts state
    setUniqueCasts(Array.from(castMap.values()));
  };

  const handleDelete = async (movie_id) => {
    try {
      await api.delete(`/casts/${movie_id}`);
      fetchCasts();
    } catch (error) {
      console.error('Error deleting cast:', error);
    }
  };

  const handleOpenDialog = (cast = { movie_id: '', cast: [] }) => {
    setCurrentCast(cast);
    setEditMode(!!cast.movie_id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentCast({ movie_id: '', cast: [] });
  };

  const handleSaveCast = async () => {
    try {
      if (editMode) {
        await api.put(`/casts/${currentCast.movie_id}`, currentCast);
      } else {
        await api.post('/casts', currentCast);
      }
      fetchCasts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving cast:', error);
    }
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

      <TableContainer
        component={Paper}
        sx={{
          margin: 'auto',
          width: '95%',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
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
                  <IconButton color="secondary" onClick={() => handleDelete(cast.movie_id)}>
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
            autoFocus
            margin="dense"
            label="Movie ID"
            fullWidth
            value={currentCast.movie_id}
            onChange={(e) => setCurrentCast({ ...currentCast, movie_id: e.target.value })}
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Cast Names (comma separated)"
            fullWidth
            value={currentCast.cast.map((member) => member.name).join(', ')}
            onChange={(e) =>
              setCurrentCast({
                ...currentCast,
                cast: e.target.value.split(',').map((name) => ({ name: name.trim() })),
              })
            }
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
