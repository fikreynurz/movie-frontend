import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Movie = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <Typography variant="h5">No movies found or loading...</Typography>;
  }

  return (
    <>
      {movies.map((movie) => (
        <Box key={movie.id} sx={{ minWidth: 200 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1c1c1c',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              sx={{ height: 350, objectFit: 'cover', borderRadius: '8px' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" noWrap>
                {movie.title}
              </Typography>
              <Typography variant="body2" color="white">
                {movie.release_date}
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/movie/${movie.id}`}
              sx={{
                width: '100%',
                marginTop: 'auto',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#2196f3',
                },
              }}
            >
              View Details
            </Button>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default Movie;
