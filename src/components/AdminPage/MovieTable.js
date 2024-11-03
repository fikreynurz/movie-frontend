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

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    adult: false,
    backdrop: null,
    poster: null,
    genre_ids: [],
    original_language: "",
    original_title: "",
    overview: "",
    popularity: 0,
    release_date: "",
    video: false,
    vote_average: 0,
    vote_count: 0,
    category: [],
    production_countries: [{ alias: "", english_name: "", native_name: "" }],
  });

  const navigate = useNavigate();

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

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleAddMovie = async () => {
    const formData = new FormData();
    Object.keys(newMovie).forEach((key) => {
      if (key === "backdrop" || key === "poster") {
        formData.append(key, newMovie[key]);
      } else if (Array.isArray(newMovie[key])) {
        formData.append(key, JSON.stringify(newMovie[key])); // For arrays, convert to JSON string
      } else {
        formData.append(key, newMovie[key]);
      }
    });
  
    try {
      await api.post("/movies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMovies();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  

  const handleCountryChange = (index, field, value) => {
    const updatedCountries = [...newMovie.production_countries];
    updatedCountries[index] = { ...updatedCountries[index], [field]: value };
    setNewMovie((prev) => ({ ...prev, production_countries: updatedCountries }));
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

        <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginLeft: 2 }}>
          Add Movie
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          margin: "auto",
          width: "95%",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
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
                  {movie.isApproved === true ? (
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: "rgba(0, 21, 41, 0.85)", maxWidth: 600, margin: "auto", mt: "10%" }}>
          <Typography variant="h6" gutterBottom>
            Add New Movie
          </Typography>
          <Box
            sx={{
              maxHeight: "65vh",  // Mengatur tinggi maksimum konten modal
              overflowY: "auto",  // Mengaktifkan scroll secara vertikal
              pr: 2               // Memberi sedikit padding pada sisi kanan untuk ruang scroll
            }}
          >
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
          <Button onClick={handleCloseModal} sx={{ ml: 2 }}>Cancel</Button>
        </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MovieTable;