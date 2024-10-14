import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Card, CardMedia, Avatar, Button, Divider, Modal, Rating, TextField, CircularProgress } from '@mui/material';

const Detail = () => {
  const { id } = useParams();  // Mengambil ID dari URL
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trailer, setTrailer] = useState(null); // State untuk trailer
  const [loading, setLoading] = useState(true); // Tambahkan state untuk loading
  const [showFullReview, setShowFullReview] = useState({ open: false, content: '' }); // State untuk full review modal
  const [showMoreCast, setShowMoreCast] = useState(false); // State untuk show more cast
  const [userRating, setUserRating] = useState(0); // State untuk rating pengguna
  const [comment, setComment] = useState(''); // State untuk komentar pengguna
  const [isFavorite, setIsFavorite] = useState(false); // State untuk mengelola status favorit

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);  // Set loading menjadi true ketika mulai fetch data
      try {
        const response = await axios.get(
          // `https://api.themoviedb.org/3/movie/${id}?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&append_to_response=credits,reviews,videos`
          `http://localhost:5000/api/movies/append/${id}`
        );
        setMovie(response.data.movie);
        setReviews(response.data.review.reviews.slice(0, 3));  // Ambil 3 ulasan pertama
        
        // Mengambil video dari API response
        const trailerData = response.data.video.videos.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerData ? trailerData.key : null);
        setCast(response.data.cast.cast)
        setGenre(response.data.genre)
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);  // Set loading menjadi false ketika data sudah di-fetch
      }
    };
    fetchMovieDetails();
  }, [id]);

  // Function untuk membuka modal full review
  const handleOpenFullReview = (content) => {
    setShowFullReview({ open: true, content });
  };

  // Function untuk menutup modal full review
  const handleCloseFullReview = () => {
    setShowFullReview({ open: false, content: '' });
  };

  // Function untuk menambahkan/menyimpan film ke daftar favorit
  const handleToggleFavorite = () => {
    if (isFavorite) {
      // Hapus dari favorit (disesuaikan dengan backend atau local storage)
      console.log('Removing from favorites:', movie.title);
    } else {
      // Tambah ke favorit (disesuaikan dengan backend atau local storage)
      console.log('Adding to favorites:', movie.title);
    }
    setIsFavorite(!isFavorite); // Ubah status favorit
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
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={4}>
          {/* Poster Film */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={`http://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
              onClick={handleToggleFavorite}
              sx={{ mb: 2 }}
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
              {movie.release_date} | {movie.runtime} minutes
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
              {(showMoreCast ? (cast || []).slice(0, 5) : cast.slice(0, 5)).map((actor) => (
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
        {reviews.map((review) => (
          <Box key={review.id} my={2} p={2} border="1px solid #ddd" borderRadius="8px">
            <Typography variant="body1" gutterBottom>
              <strong>{review.author}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {review.content.length > 200
                ? `${review.content.slice(0, 200)}...`
                : review.content}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() => handleOpenFullReview(review.content)}
            >
              Read Full Review
            </Button>
          </Box>
        ))}

        {/* Modal untuk Full Review */}
        <Modal open={showFullReview.open} onClose={handleCloseFullReview}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
            <Typography variant="h6">Full Review</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>{showFullReview.content}</Typography>
            <Button onClick={handleCloseFullReview} sx={{ mt: 2 }} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Modal>

        {/* Add a comment section with Material UI */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Your Review
          </Typography>
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
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => console.log('Submit comment', comment, userRating)}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Detail;