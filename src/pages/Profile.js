import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Avatar, Box, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Jika Anda menggunakan backend untuk mengambil data favorit dan ulasan

const Profile = () => {
  const [favorites, setFavorites] = useState([]);  // State untuk daftar film favorit
  const [reviews, setReviews] = useState([]);  // State untuk ulasan pengguna
  const [user, setUser] = useState({ name: 'John Doe', profilePic: 'https://via.placeholder.com/150' });  // Mock data pengguna

  // Fungsi ini akan fetch data dari API (sesuaikan dengan backend Anda)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ganti dengan API Anda untuk mendapatkan data favorit dan ulasan pengguna
        const favoriteResponse = await axios.get(`/api/user/favorites`);
        const reviewsResponse = await axios.get(`/api/user/reviews`);
        setFavorites(favoriteResponse.data);  // Simpan data favorit
        setReviews(reviewsResponse.data);  // Simpan data ulasan
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {/* Section Profile */}
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            alt={user.name}
            src={user.profilePic}
            sx={{ width: 150, height: 150, marginRight: 4 }}
          />
          <Typography variant="h4">{user.name}</Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Section Daftar Favorit */}
        <Typography variant="h5" gutterBottom>
          Favorite Movies
        </Typography>
        {favorites.length > 0 ? (
          <Grid container spacing={4}>
            {favorites.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '8px' }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ height: 350, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                      {movie.title}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/movie/${movie.id}`}
                    sx={{ width: '100%', marginTop: 'auto' }}
                  >
                    View Details
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No favorite movies found.</Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Section Ulasan Pengguna */}
        <Typography variant="h5" gutterBottom>
          Your Reviews
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Box key={review.id} my={2} p={2} border="1px solid #ddd" borderRadius="8px">
              <Typography variant="body1" gutterBottom>
                <strong>{review.movie_title}</strong> — {review.created_at}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {review.content}
              </Typography>
              <Button
                variant="text"
                color="primary"
                component={Link}
                to={`/movie/${review.movie_id}`}
              >
                View Movie
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No reviews found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
