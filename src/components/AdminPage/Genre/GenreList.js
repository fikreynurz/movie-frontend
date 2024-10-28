import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CssBaseline,
  TablePagination,
  IconButton,
} from "@mui/material";
import { ThemeProvider} from "@mui/material/styles";
import AdminSidebar from "../AdminSidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DarkTheme from "../../../theme";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [adminName, setAdminName] = useState("");

  // Fetch genres from the backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/genres"); // Update with the correct endpoint
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

  // Pagination logic: slice the genres based on the page and rowsPerPage
  const paginatedGenres = genres.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <>
      <ThemeProvider theme={DarkTheme}>
        <CssBaseline />
        <AdminSidebar />
        <Container maxWidth="lg" style={{ marginTop: "50px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Genre List
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Genre Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGenres.map((genre) => (
                  <TableRow key={genre.id}>
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={genres.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default GenreList;
