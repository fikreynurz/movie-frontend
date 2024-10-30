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
  Box,
  Container,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import AdminSidebar from "../AdminSidebar";
import api from "../../Api";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Sama dengan rows per page di MovieTable
  const [adminName, setAdminName] = useState("");

  // Fetch genres from the backend
  useEffect(() => {
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

  return (
    <>
      <AdminSidebar />
      <Box sx={{ margin: "auto", width: "95%", padding: 2 }}>
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
    </>
  );
};

export default GenreList;
