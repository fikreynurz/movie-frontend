import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Movie from '../components/Movie/Movie';
import api from '../components/Api';

const Profile = () => {
  const userLoggedIn = localStorage.getItem("user");
  const userParsed = JSON.parse(userLoggedIn);
  const userName = userParsed.name;
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [user, setUser] = useState({
    name: userName.toUpperCase(),
    profilePic: 'https://via.placeholder.com/150',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userParsed);
    if (!userLoggedIn) {
      navigate('/');
    }

    const fetchFavoriteMovies = async () => {
      setLoadingFavorites(true);
      try {
        const response = await api.get(`/users/${userParsed.uid}/favorite-movies`);
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorite movies:', error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteMovies();
  }, []);

  return (
    <>
      {/* Button "Back" */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, pt: 2 }}>
        <Button
          color="inherit"
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            fontSize: { xs: '0.8rem', sm: '1rem' },
            padding: { xs: '4px 8px', sm: '6px 12px' },
          }}
        >
          Back
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Box my={4}>
          {/* Section Profile */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            mb={4}
            gap={2}
          >
            <Avatar
              alt={user.name}
              src={user.profilePic}
              sx={{
                width: { xs: 100, sm: 150 },
                height: { xs: 100, sm: 150 },
              }}
            />
            <Typography variant="h4" textAlign={{ xs: 'center', sm: 'left' }}>
              {user.name}
            </Typography>
          </Box>

          {/* Section Daftar Favorit */}
          <Typography variant="h5" gutterBottom>
            Favorite Movies
          </Typography>

          {loadingFavorites ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : favorites.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {favorites.map((movie) => (
                <Movie key={movie.id} movies={[movie]} />
              ))}
            </Box>
          ) : (
            <Typography textAlign="center" color="textSecondary">
              No favorite movies found.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Profile;