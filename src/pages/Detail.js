// src/components/Detail.js
import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Box, Card, CardMedia, Avatar, 
  Button, Divider, Modal, Rating, TextField, CircularProgress, 
  Snackbar, Alert 
} from '@mui/material';
import { format } from 'date-fns'; // Untuk memformat tanggal
import api from '../components/Api';

const Detail = () => {
  const { id } = useParams();  // Mengambil ID dari URL
  const navigate = useNavigate(); // Untuk navigasi setelah login
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullReview, setShowFullReview] = useState({ open: false, content: '' });
  const [showMoreCast, setShowMoreCast] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(''); // State untuk nama author
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [user, setUser] = useState(null); // State untuk data pengguna
  const [backdropUrl, setBackdropUrl] = useState(null);

  // Fungsi untuk menutup Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date)) return 'Unknown date';
    
    return format(date, 'PPP'); // Formats the date as 'April 27th, 2024'
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Cek status favorit
        const isMovieFavorite = parsedUser.favoriteMovie?.includes(parseInt(id, 10));
        setIsFavorite(!!isMovieFavorite);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [id]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/movies/append/${id}`);
        setMovie(response.data.movie);
        setReviews(response.data.review ? response.data.review.reviews : []);

        // Log the reviews to inspect their structure
        console.log("Fetched Reviews:", response.data.review ? response.data.review.reviews : []);

        const trailerData = response.data.video.videos.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerData ? trailerData.key : null);
        setCast(response.data.cast.cast);
        setGenre(response.data.genre);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchBackdrop = async () => {
      try {
        const response = await api.get(`/movies/backdrop/${id}`, {
          responseType: 'blob', // Fetch as a Blob to use as an image source
        });
        const imageUrl = URL.createObjectURL(response.data); // Convert Blob to URL
        setBackdropUrl(imageUrl); // Set the image URL to state
      } catch (error) {
        console.error('Error fetching backdrop:', error);
      }
    };
  
    fetchBackdrop();
  }, [id]);  

  const handleAddToFavorites = async () => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to add to favorites.', severity: 'error' });
      return;
    }

    try {
      const response = await api.put(`/users/${user.uid}/favorite-movie`, {
        movie_id: id // Mengirimkan ID film yang ingin ditambahkan ke favorit
      });
      console.log(user.uid)

      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Added to favorites!', severity: 'success' });
        setIsFavorite(true); // Update state isFavorite
      } else {
        setSnackbar({ open: true, message: 'Failed to add to favorites.', severity: 'error' });
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setSnackbar({ open: true, message: 'An error occurred while adding to favorites.', severity: 'error' });
    }
  };

  // Fungsi untuk menangani penghapusan film dari favorit
  const handleRemoveFromFavorites = async () => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to remove from favorites.', severity: 'error' });
      return;
    }  

    try {
      const response = await api.delete(`/users/${user.uid}/favorite-movie/${id}`); // Ganti dengan endpoint yang sesuai

      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Removed from favorites!', severity: 'success' });
        setIsFavorite(false); // Update state isFavorite
      } else {
        setSnackbar({ open: true, message: 'Failed to remove from favorites.', severity: 'error' });
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setSnackbar({ open: true, message: 'An error occurred while removing from favorites.', severity: 'error' });
    }
  };

  // Fungsi untuk menangani submit review
  const handleSubmitReview = async () => {
    if ((!user && !authorName.trim()) || !userRating || !comment.trim()) {
      setSnackbar({ open: true, message: 'Please provide your name, rating, and comment.', severity: 'error' });
      return;
    }

    // If the backend expects ratings out of 10, multiply by 2
    const scaledRating = userRating * 2;

    const newReview = {
      movie_id: parseInt(id, 10), // Pastikan movie_id adalah Number sesuai dengan schema
      author: user ? user.name : authorName.trim(), // Gunakan nama dari user jika login
      author_details: {
        name: user ? user.name : authorName.trim(),
        username: user 
          ? user.name.toLowerCase().replace(/\s+/g, '_') 
          : authorName.trim().toLowerCase().replace(/\s+/g, '_'), // Contoh sederhana pembuatan username
        avatar_path: user ? user.avatar_path : null, // Gunakan avatar dari user jika tersedia
        rating: scaledRating, // Mengirimkan rating yang telah diskalakan
      },
      content: comment,
      rating: scaledRating, // Menambahkan rating ke review
      url: null, // Jika ada URL ulasan
      created_at: new Date().toISOString()
    };

    try {
      const response = await api.post('/reviews/', newReview);
      if (response.status === 201) {
        setSnackbar({ open: true, message: 'Review added successfully!', severity: 'success' });
        // Reset form
        setUserRating(0);
        setComment('');
        if (!user) setAuthorName('');
        // Update state reviews dengan ulasan baru yang sudah disimpan di backend
        setReviews(prevReviews => [
          response.data.review, 
          ...prevReviews
        ]
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 3));
      } else {
        setSnackbar({ open: true, message: 'Failed to add review.', severity: 'error' });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSnackbar({ open: true, message: 'An error occurred while submitting your review.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return <Typography variant="h5">No movie details found.</Typography>;
  }

  return (
    <>
      {backdropUrl && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            opacity: 0.3, // Adjust transparency
          }}
        />
      )}
    
    <>
    {/* Button "Back" di luar Container */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, pt: 2 }}>
      <Button
        color="inherit"
        size="small"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>

    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          {/* Poster Film */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={`https://backend-api.larasbasa.com/api/movies/poster/${id}`}
                alt={movie.title}
              />
            </Card>
          </Grid>

          {/* Informasi Film */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {movie.title}
            </Typography>

            {/* Tombol Add to Favorites */}
            <Button
              variant="contained"
              color={isFavorite ? 'secondary' : 'primary'}
              onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>

            {/* Trailer Section */}
            {trailer ? (
              <Box my={2}>
                <iframe
                  width="100%"
                  height="400px"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f0f0f0'
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Trailer not available
                </Typography>
              </Box>
            )}

            <Typography variant="h6" color="textSecondary" gutterBottom>
              {movie.release_date} 
              {/* | {movie.runtime} minutes */}
            </Typography>

            {/* Tambahkan Negara Produksi */}
            <Typography variant="body1" gutterBottom>
              <strong>Production Countries:</strong> {(movie.production_countries || []).map((country) => country.english_name).join(', ') || 'Unknown'}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Genres:</strong> {(genre || []).map((g) => g.name).join(', ') || 'Unknown'}
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>Synopsis:</strong> {movie.overview}
            </Typography>

            {/* Tampilkan Rating sebagai Bintang */}
            <Typography variant="body1" gutterBottom>
              <strong>Rating:</strong>
              <Rating
                value={Math.round(movie.vote_average) / 2}  // Bagi dua karena rating TMDB dari 10, sedangkan rating bintang biasanya dari 5
                readOnly
                precision={0.5}  // Bintang setengah diperbolehkan
              />{' '}
              ({Math.round(movie.vote_average)}/10)
            </Typography>

            <Typography variant="h5" gutterBottom>
              Cast
            </Typography>
            <Grid container spacing={2}>
              {(showMoreCast ? (cast || []) : (cast || []).slice(0, 5)).map((actor) => (
                <Grid item key={actor?.id} xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={actor?.name}
                      src={actor?.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/56'}
                      sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <div>
                      <Typography variant="body1">{actor?.name || 'Unknown'}</Typography>
                      <Typography variant="body2" color="textSecondary">{actor?.character || 'Unknown Character'}</Typography>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {cast.length > 5 && (
              <Button onClick={() => setShowMoreCast(!showMoreCast)} sx={{ mt: 2 }}>
                {showMoreCast ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Ulasan Pengguna */}
        <Typography variant="h5" gutterBottom>
          User Reviews
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index} my={2} p={2} border="1px solid #ddd" borderRadius="8px">
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Avatar
                    alt={review.author_details.name || review.author}
                    src={review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}` : 'https://via.placeholder.com/40'}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1"><strong>{review.author}</strong></Typography>
                  <Typography variant="body2" color="textSecondary">
                    {/* Scale the rating down by 2 if it's out of 10 */}
                    <Rating 
                      value={Math.round(review.author_details.rating) / 2} 
                      readOnly 
                      precision={0.5} 
                    />{' '}
                    ({review.author_details.rating} / 10)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {/* Use the helper function to format the date */}
                    {formatDate(review.created_at || review.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" color="textSecondary" paragraph>
                {review.content.length > 200
                  ? `${review.content.slice(0, 200)}...`
                  : review.content}
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowFullReview({ open: true, content: review.content })}
              >
                Read Full Review
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No reviews yet. Be the first to review!</Typography>
        )}

        {/* Modal untuk Full Review */}
        <Modal open={showFullReview.open} onClose={() => setShowFullReview({ open: false, content: '' })}>
          <Box sx={{ 
            position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 400 }, 
            bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2 
          }}>
            <Typography variant="h6">Full Review</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>{showFullReview.content}</Typography>
            <Button onClick={() => setShowFullReview({ open: false, content: '' })} sx={{ mt: 2 }} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Modal>

        {/* Add a comment section with Material UI */}
        <Box 
          sx={{ 
            mt: 4, 
            position: 'relative' 
          }}
        >
          {/* Blurred Content */}
          <Box sx={{ filter: !user ? 'blur(4px)' : 'none', pointerEvents: !user ? 'none' : 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Add Your Review
            </Typography>
            {user ? (
              <>
                {/* Jika pengguna sudah login, nama author otomatis diisi */}
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Your Name:</strong> {user.name}
                </Typography>
              </>
            ) : (
              // Jika pengguna belum login, tampilkan input untuk nama
              <TextField
                label="Your Name"
                fullWidth
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            <Rating
              name="user-rating"
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              precision={0.5}
            />
            <TextField
              label="Write your comment"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
              disabled={!user} // Nonaktifkan input jika pengguna belum login
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitReview}
                disabled={!user} // Nonaktifkan tombol jika pengguna belum login
              >
                Submit
              </Button>
            </Box>
          </Box>

          {/* Overlay */}
          {!user && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                bgcolor: 'rgba(255, 255, 255, 0.8)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 1 
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Please log in to add your review.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </Box>
          )}
        </Box>

        {/* Snackbar untuk feedback */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
    </>
    </>
  );
};

export default Detail;