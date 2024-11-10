import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Modal,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../Api";
import AddMovieModal from "./Movie/AddMovieModal";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false); // Use modal state here

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await api.delete(`/movies/${id}`);
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <AdminSidebar />
      <Box sx={{ margin: "auto", width: "95%", padding: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel id="status-label">Filter by Status</InputLabel>
          <Select
            labelId="status-label"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Unapproved">Unapproved</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search by Title"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ marginLeft: 2 }}>
          Add Movie
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ margin: "auto", width: "95%", boxShadow: 3, borderRadius: 2 }}>
        {/* Table content here */}
      </TableContainer>
      
      <AddMovieModal open={openModal} handleClose={() => setOpenModal(false)} fetchMovies={fetchMovies} />
    </>
  );
};

export default MovieTable;