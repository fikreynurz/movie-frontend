import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Movie from '../components/Movie/Movie';

const Profile = () => {
  const userLoggedIn = localStorage.getItem("user");
  const userParsed = JSON.parse(userLoggedIn);
  const userName = userParsed.name;
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true); // Loading state untuk daftar film favorit
  const [user, setUser] = useState({ name: userName.toUpperCase(), profilePic: 'https://via.placeholder.com/150' });
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userParsed);
    if (!userLoggedIn) {
      navigate('/');
    }
    
    const fetchFavoriteMovies = async () => {
      setLoadingFavorites(true); // Set loading true saat mulai fetch data favorite
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userParsed.uid}/favorite-movies`);
        setFavorites(response.data);  // Simpan data favorit ke state
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      } finally {
        setLoadingFavorites(false); // Set loading false setelah selesai fetch data
      }
    };

    fetchFavoriteMovies();
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

        {/* Section Daftar Favorit */}
        <Typography variant="h5" gutterBottom>
          Favorite Movies
        </Typography>

        {loadingFavorites ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : favorites.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {favorites.map((movie) => (
                <Movie key={movie.id} movies={[movie]} />
              ))}
            </Box>
            {/* Tombol "View More" jika ingin menambah pagination atau daftar panjang
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button component={Link} to="/favorites" variant="contained" color="primary">
                View More
              </Button>
            </Box> */}
          </>
        ) : (
          <Typography>No favorite movies found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
