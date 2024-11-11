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
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
//import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../Api";
import AddMovieModal from "./Movie/AddMovieModal";
import EditApprovalModal from "./Movie/EditMovieModal";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditApprovalModal, setOpenEditApprovalModal] = useState(false); // State untuk modal edit approval
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieApprovalStatus, setSelectedMovieApprovalStatus] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEditApproval = (movieId, isApproved) => {
    setSelectedMovieId(movieId);
    setSelectedMovieApprovalStatus(isApproved);
    setOpenEditApprovalModal(true);
  };

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

  const displayedMovies = movies
    .filter((movie) => {
      const matchesStatus = statusFilter
        ? movie.isApproved === (statusFilter === "Approved")
        : true;
      const matchesTitle = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesTitle;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
              <TableCell sx={{ color: "#fff", width: '13%' }}><strong>Title</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '10%' }}><strong>Casts</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '10%' }}><strong>Genres</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '40%' }}><strong>Synopsis</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '5%' }}><strong>Status</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '5%' }}><strong>Action</strong></TableCell>
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
                    onClick={() => handleEditApproval(movie.id, movie.isApproved)}
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

      {/* AddMovieModal is called here */}
      <AddMovieModal open={openModal} handleClose={() => setOpenModal(false)} fetchMovies={fetchMovies} />        
        {/* EditApprovalModal is called here */}
        <EditApprovalModal
          open={openEditApprovalModal}
          handleClose={() => setOpenEditApprovalModal(false)}
          movieId={selectedMovieId}
          currentStatus={selectedMovieApprovalStatus}
          fetchMovies={fetchMovies} // Jika `fetchMovies` diperlukan untuk refresh setelah update
        />
    </>
  );
};

export default MovieTable;