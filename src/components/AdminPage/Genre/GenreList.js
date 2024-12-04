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
  Box,
  Modal,
  Button,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import AdminSidebar from "../AdminSidebar";
import api from "../../Api";
import Swal from "sweetalert2";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Sama dengan rows per page di MovieTable
  const [adminName, setAdminName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [newGenreError, setNewGenreError] = useState("");

  const fetchGenres = async () => {
    try {
      const response = await api.get("/genres"); // Update dengan endpoint yang sesuai
      setGenres(response.data.genres);
      const userLogged = localStorage.getItem("user");
      const userParsed = JSON.parse(userLogged);
      setAdminName(userParsed.name);
    } catch (err) {
      console.error("Failed to fetch genres:", err);
    }
  };


  useEffect(() => {
    fetchGenres();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply pagination to genres
  const displayedGenres = genres.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleAddGenre = async () => {
    console.log("Current Genre:", newGenre);
    console.log("Existing Genres:", genres);
  
    if (!newGenre.trim()) {
      setNewGenreError("Genre name is required");
      return;
    }
  
    if (genres.some((genre) => genre.name.toLowerCase() === newGenre.toLowerCase())) {
      setNewGenreError("Genre name already exists");
      return;
    }
  
    try {
      const response = await api.post("/genres", { name: newGenre });
      setGenres((prevGenres) => [...prevGenres, response.data]);
      handleCloseModal();
      setNewGenre("");
      setNewGenreError("");
  
      // Tambahkan SweetAlert2 untuk notifikasi sukses
      console.log("SweetAlert will fire!");
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Genre successfully added!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error adding genre:", error);
    }
  };  

  return (
    <>
      <AdminSidebar />
      <Box sx={{ margin: "auto", width: "95%", padding: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Genre
        </Button>
        <Typography variant="h4" align="center" gutterBottom>
          Genre List
        </Typography>
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
              <TableCell sx={{ color: "#fff", width: '20%' }}><strong>ID</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '60%' }}><strong>Genre Name</strong></TableCell>
              <TableCell sx={{ color: "#fff", width: '20%', textAlign: "center" }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedGenres.map((genre) => (
              <TableRow key={genre.id} hover>
                <TableCell>{genre.id}</TableCell>
                <TableCell>{genre.name}</TableCell>
                <TableCell align="center">
                  <IconButton color="info">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Sama dengan opsi di MovieTable
          component="div"
          count={genres.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

            {/* Modal for Adding New Genre */}
        <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ 
          p: 4, 
          backgroundColor: "rgba(0, 21, 41, 0.85)", 
          borderRadius: 2, 
          maxWidth: 400, 
          margin: "auto", 
          mt: "10%",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        }}>
          <Typography variant="h6" gutterBottom>Add New Genre</Typography>
          <TextField
            id="genre-input"
            label="Genre Name"
            variant="outlined"
            fullWidth
            value={newGenre}
            onChange={(e) => {
              setNewGenre(e.target.value);
              setNewGenreError(""); // Reset error saat input berubah
            }}
            error={!!newGenreError} // Jika ada error
            helperText={newGenreError || ""} // Tampilkan pesan error
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddGenre}>
              Submit
            </Button>
            <Button onClick={handleCloseModal} sx={{ ml: 2 }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GenreList;
