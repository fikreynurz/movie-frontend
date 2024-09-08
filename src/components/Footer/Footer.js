import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',  // Sesuaikan dengan warna header
        color: 'white',
        py: 3, // Padding vertical
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Section 1: Informasi Situs */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              JAKRIE Movie Database
            </Typography>
            <Typography variant="body2">
              Discover movies, TV shows, and explore the world of cinema with JAKRIE Movie Database.
            </Typography>
          </Grid>

          {/* Section 2: Navigasi */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <br />
            <Link href="/about" color="inherit" underline="hover">
              About Us
            </Link>
            <br />
            <Link href="/contact" color="inherit" underline="hover">
              Contact Us
            </Link>
            <br />
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
          </Grid>

          {/* Section 3: Media Sosial */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com" color="inherit" underline="hover">
              Facebook
            </Link>
            <br />
            <Link href="https://www.twitter.com" color="inherit" underline="hover">
              Twitter
            </Link>
            <br />
            <Link href="https://www.instagram.com" color="inherit" underline="hover">
              Instagram
            </Link>
          </Grid>
        </Grid>

        {/* Copyright */}
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
