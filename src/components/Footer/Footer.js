import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto', // Make footer stick to bottom
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              JAKRIE Movie Database
            </Typography>
            <Typography variant="body2">
              Discover movies, TV shows, and explore the world of cinema with JAKRIE Movie Database.
            </Typography>
          </Grid>
        </Grid>

        <Box textAlign="center" pt={4}>
          <Typography variant="body2">
            © {new Date().getFullYear()} JAKRIE Movie Database. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
