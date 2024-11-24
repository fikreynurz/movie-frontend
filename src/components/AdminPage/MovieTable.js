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
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../Api";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    console.log("Updated movies:", movies);
  }, [movies]);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      console.log("Fetched Movies:", response.data); // Debugging
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

  const handleEditMovie = (movieId) => {
    // Mengarahkan ke halaman EditMoviePage dengan movieId
    navigate(`/admin/edit-movie/${movieId}`);
  };

  const filteredMovies = movies.filter((movie) => {
    if (statusFilter === "Approved") return movie.isApproved === true || movie.isApproved === "Approved";
    if (statusFilter === "Unapproved") return movie.isApproved === false || movie.isApproved === "Unapproved";
    return true;
  });

  const displayedMovies = movies
  .filter((movie) => {
    if (statusFilter === "Approved") {
      return movie.isApproved === "Approved"; // String comparison
    } else if (statusFilter === "Unapproved") {
      return movie.isApproved === "Unapproved"; // String comparison
    }
    return true; // Jika tidak ada filter, tampilkan semua
  })
  .filter((movie) => {
    // Filter berdasarkan search query pada judul
    return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
  })
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (page > Math.ceil(filteredMovies.length / rowsPerPage) - 1) {
      setPage(0); // Reset ke halaman pertama jika data berkurang
    }
  }, [filteredMovies, rowsPerPage, page]);
  
  console.log("Displayed Movies:", displayedMovies); // Debugging
  console.log("Filtered Movies:", filteredMovies.length); // Debugging

    return (
      <>
        <AdminSidebar />
        <Box sx={{ margin: "auto", width: "95%", padding: 2 }}>
          {/* Dropdown untuk Filter Status */}
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
  
          {/* Input untuk Search Judul */}
          <TextField
            label="Search by Title"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
  
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-movie")}
            sx={{ marginLeft: 2 }}
          >
            Add Movie
          </Button>
        </Box>
  
        {/* Tabel Movie */}
        <TableContainer component={Paper} sx={{ margin: "auto", width: "95%", boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
                <TableCell sx={{ color: "#fff", width: "13%" }}>
                  <strong>Title</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", width: "10%" }}>
                  <strong>Casts</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", width: "10%" }}>
                  <strong>Genres</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", width: "40%" }}>
                  <strong>Synopsis</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", width: "5%" }}>
                  <strong>Status</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", width: "5%" }}>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedMovies.map((movie) => (
                <TableRow key={movie.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {movie.title}
                    </Typography>
                  </TableCell>
  
                  <TableCell>
                    {movie.cast?.length >= 3
                      ? `${movie.cast.slice(0, 2).map((c) => c.name).join(", ")}, etc`
                      : movie.cast?.map((castMember) => castMember.name).join(", ")}
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
                    {movie.isApproved === true || movie.isApproved === "Approved" ? (
                      <Typography color="green">
                        <strong>Approved</strong>
                      </Typography>
                    ) : (
                      <Typography color="red">
                        <strong>Unapproved</strong>
                      </Typography>
                    )}
                  </TableCell>
  
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditMovie(movie.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(movie.id)}>
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
            count={filteredMovies.length} // Menggunakan total data yang sudah difilter
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </TableContainer>
      </>
    );
  };

export default MovieTable;
