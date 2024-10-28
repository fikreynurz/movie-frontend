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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15); // Menentukan jumlah movie per halaman
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [openModal, setOpenModal] = useState(false); // Kontrol modal
  const [newMovie, setNewMovie] = useState({
    title: "",
    adult: false,
    backdrop_path: null,
    poster_path: null,
    genre_ids: [],
    original_language: "",
    original_title: "",
    overview: "",
    popularity: 0,
    release_date: "",
    vote_average: 0,
    vote_count: 0,
    category: [],
    production_countries: [],
  });

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

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: files[0] })); // Set file yang diupload
  };

  const handleAddMovie = async () => {
    const formData = new FormData();
    Object.keys(newMovie).forEach((key) => {
      if (key === "backdrop_path" || key === "poster_path") {
        formData.append(key, newMovie[key]);
      } else {
        formData.append(key, JSON.stringify(newMovie[key]));
      }
    });

    try {
      await axios.post("http://localhost:5000/api/movies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMovies(); // Refresh data setelah tambah movie
      handleCloseModal(); // Tutup modal
    } catch (error) {
      console.error("Error adding movie:", error);
    }
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

        <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginLeft: 2 }}>
          Add Movie
        </Button>
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

      {/* Modal for Adding New Movie */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: "white", maxWidth: 600, margin: "auto", mt: "10%" }}>
          <Typography variant="h6" gutterBottom>
            Add New Movie
          </Typography>

          <TextField
            label="Title"
            name="title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMovie.title}
            onChange={handleInputChange}
          />

          <TextField
            label="Original Title"
            name="original_title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newMovie.original_title}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Backdrop Image</InputLabel>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload
              <input
                type="file"
                name="backdrop_path"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Poster Image</InputLabel>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload
              <input
                type="file"
                name="poster_path"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>

          <TextField
            label="Overview"
            name="overview"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newMovie.overview}
            onChange={handleInputChange}
          />

          {/* Additional fields for genre_ids, production_countries, etc. */}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddMovie}>
              Submit
            </Button>
            <Button onClick={handleCloseModal} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MovieTable;
