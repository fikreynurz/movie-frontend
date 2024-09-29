import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Typography,
  TextField,
  Grid,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CssBaseline,
  TablePagination,
} from "@mui/material";
import ResponsiveAppBar from "../AdminNavbar";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AdminSidebar from "../AdminSidebar";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilmId, setSearchFilmId] = useState("");
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews");
        console.log("Response data:", response.data); // Log response data

        const allReviews = [];
        response.data.forEach((reviewData) => {
          if (reviewData && reviewData.reviews && reviewData.reviews.results) {
            const reviewsWithFilmId = reviewData.reviews.results.map(
              (review) => ({
                ...review,
                film_id: reviewData.film_id,
                avatar_path: reviewData.avatar_path || "", // Assuming avatar_path is part of reviewData
              })
            );
            allReviews.push(...reviewsWithFilmId);
          } else {
            console.error("Unexpected response structure:", reviewData);
          }
        });

        setReviews(allReviews);
        setFilteredReviews(allReviews);

        const userLogged = localStorage.getItem("user");
        const userParsed = JSON.parse(userLogged);
        setAdminName(userParsed.name);
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
        (review) =>
          review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchFilmId) {
      filtered = filtered.filter((review) =>
        review.film_id.toString().includes(searchFilmId)
      );
    }

    console.log("Filtered reviews:", filtered); // Log filtered reviews
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleDelete = (id) => {
    setSelectedReviews([id]);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectedReviews.map(async (reviewId) => {
          await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
        })
      );
      setReviews(
        reviews.filter((review) => !selectedReviews.includes(review.id))
      );
      setSelectAll(false);
      setSelectedReviews([]);
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReviews([]);
  };

  const handleShowDetails = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReview(null);
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

  const theme = createTheme({
    typography: {
      fontFamily: "Sans, Arial, sans-serif",
      fontWeight: "bold",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AdminSidebar />
        <Container maxWidth="lg" style={{ marginTop: "50px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Review List
          </Typography>

          <Grid container spacing={2} style={{ marginBottom: "20px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by Author or Content"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by Film ID"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                value={searchFilmId}
                onChange={(e) => setSearchFilmId(e.target.value)}
              />
            </Grid>
          </Grid>

          {selectedReviews.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowDeleteModal(true)}
              style={{ marginBottom: "20px" }}
            >
              Delete Selected Reviews
            </Button>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>Film ID</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell align="center">Actions</TableCell>
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
                    <TableRow key={review.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{review.film_id}</TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>
                        {review.content.length > 100
                          ? `${review.content.substring(0, 100)}...`
                          : review.content}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="info"
                          onClick={() => handleShowDetails(review)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(review.id)}
                        >
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

          <Dialog open={showDetailModal} onClose={closeDetailModal}>
            <DialogTitle>Review Details</DialogTitle>
            <DialogContent>
              {selectedReview && (
                <>
                  {selectedReview.author_details.avatar_path && (
                    <DialogContentText>
                      <strong>Avatar:</strong>{" "}
                      <img
                        src={`https://image.tmdb.org/t/p/w200${selectedReview.author_details.avatar_path}`}
                        alt="Avatar"
                        style={{
                          width: "500px",
                          height: "auto",
                          borderRadius: "0%",
                        }}
                      />
                    </DialogContentText>
                  )}
                  <DialogContentText>
                    <strong>Author:</strong> {selectedReview.author}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Content:</strong> {selectedReview.content}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Rating:</strong>{" "}
                    {selectedReview.author_details.rating || "N/A"}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedReview.created_at).toLocaleDateString()}
                  </DialogContentText>
                  <DialogContentText>
                    <strong>URL:</strong>{" "}
                    <a
                      href={selectedReview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedReview.url}
                    </a>
                  </DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDetailModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the selected reviews?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default ReviewList;
