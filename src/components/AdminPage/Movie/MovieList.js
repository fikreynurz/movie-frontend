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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15); // Menentukan jumlah movie per halaman
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${id}`);
        fetchMovies(); // Refresh the movie list after delete
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate movies to be displayed on the current page
  const displayedMovies = movies
    .filter((movie) => {
      const matchesStatus = statusFilter
        ? movie.isApproved === statusFilter
        : true; // Include all if no filter is set
      const matchesTitle = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()); // Filter by title
      return matchesStatus && matchesTitle; // Return true if both conditions are met
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AdminSidebar />
      <Box sx={{ margin: "auto", width: "90%", padding: 2 }}>
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
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          margin: "auto",
          width: "90%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}><strong>Title</strong></TableCell>
              <TableCell sx={{ color: "#fff" }}><strong>Casts</strong></TableCell>
              <TableCell sx={{ color: "#fff" }}><strong>Genres</strong></TableCell>
              <TableCell sx={{ color: "#fff" }}><strong>Synopsis</strong></TableCell>
              <TableCell sx={{ color: "#fff" }}><strong>Status</strong></TableCell>
              <TableCell sx={{ color: "#fff" }}><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMovies.map((movie) => (
              <TableRow key={movie.id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">{movie.title}</Typography>
                </TableCell>

                <TableCell>
                  {movie.cast.length >= 3
                    ? `${movie.cast
                        .slice(0, 2)
                        .map((c) => c.name)
                        .join(", ")}, etc`
                    : movie.cast
                        .map((castMember) => castMember.name)
                        .join(", ")}
                </TableCell>

                <TableCell>{movie.genre_ids.join(", ")}</TableCell>

                <TableCell
                  style={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography variant="body2">{movie.overview}</Typography>
                </TableCell>

                <TableCell>
                  {movie.isApproved === "Approved" ? (
                    <Typography color="green"><strong>Approved</strong></Typography>
                  ) : (
                    <Typography color="red"><strong>Unapproved</strong></Typography>
                  )}
                </TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/movies/update/${movie.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(movie.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={movies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </TableContainer>
    </>
  );
};

export default MovieList;
