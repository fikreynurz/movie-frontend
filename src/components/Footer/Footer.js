import React from 'react';
import { Box, Container, Grid, Typography} from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',  // Dark blue background
        color: 'white',
        py: 2,  // Reduce padding to shrink footer height
        px: 2,  // Optional, can reduce horizontal padding if needed
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>  {/* Reduce spacing between grid items */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              JAKRIE Movie Database
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}> {/* Slightly smaller font */}
              Discover movies, TV shows, and explore the world of cinema with JAKRIE Movie Database.
            </Typography>
          </Grid>

          {/* Adjust spacing for the Quick Links and Social Media sections similarly */}

        </Grid>
        <Box textAlign="center" pt={2}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}> {/* Slightly smaller font */}
            © {new Date().getFullYear()} JAKRIE Movie Database. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
