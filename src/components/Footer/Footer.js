import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        mt: 'auto',  // Ensure footer sticks to bottom if content is less
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              JAKRIE Movie Database
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              Discover movies, TV shows, and explore the world of cinema with JAKRIE Movie Database.
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" pt={2}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} JAKRIE Movie Database. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
