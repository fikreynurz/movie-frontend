import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../Api";
import AdminSidebar from "../AdminSidebar";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilmId, setSearchFilmId] = useState("");
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await api.get("/reviews");
        const allReviews = response.data.flatMap(movie =>
          movie.reviews.map(review => ({ ...review, movie_id: movie.movie_id }))
        );
        setReviews(allReviews);
        setFilteredReviews(allReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    getReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (searchQuery) {
      filtered = filtered.filter(
        review =>
          review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchFilmId) {
      filtered = filtered.filter(review =>
        review.movie_id.toString().includes(searchFilmId)
      );
    }

    setFilteredReviews(filtered);
  }, [searchQuery, searchFilmId, reviews]);

  const paginatedReviews = filteredReviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map((review) => review.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectReview = (reviewId) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter((id) => id !== reviewId));
    } else {
      setSelectedReviews([...selectedReviews, reviewId]);
    }
  };

  return (
    <>
      <AdminSidebar />
      <Container maxWidth="50px" style={{ marginTop: "50px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Review List
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search by Author or Content"
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <SearchIcon /> }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <TextField
            label="Search by Film ID"
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <SearchIcon /> }}
            value={searchFilmId}
            onChange={(e) => setSearchFilmId(e.target.value)}
          />
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff", width: '20%' }}><strong>Film ID</strong></TableCell>
                <TableCell sx={{ color: "#fff", width: '20%' }}><strong>Author</strong></TableCell>
                <TableCell sx={{ color: "#fff", width: '40%' }}><strong>Content</strong></TableCell>
                <TableCell sx={{ color: "#fff", width: '20%', textAlign: "center" }}><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReviews.map((review) => (
                  <TableRow key={review.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{review.movie_id}</TableCell>
                    <TableCell>{review.author}</TableCell>
                    <TableCell>
                      {review.content.length > 100
                        ? `${review.content.substring(0, 100)}...`
                        : review.content}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="info">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReviews.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </>
    );
  };

export default ReviewList;
