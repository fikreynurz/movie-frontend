import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Box, Card, CardMedia, Avatar, Button, Divider } from '@mui/material';

const Detail = () => {
  const { id } = useParams();  // Mengambil ID dari URL
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [trailer, setTrailer] = useState(null); // State untuk trailer

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=ac18a0e6818325589a5c34b35da509ab&language=en-US&append_to_response=credits,reviews,videos`
        );
        setMovie(response.data);
        setReviews(response.data.reviews.results.slice(0, 3));  // Ambil 3 ulasan pertama

        // Mengambil video dari API response
        const trailerData = response.data.videos.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerData ? trailerData.key : null);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <Typography variant="h5">Loading...</Typography>;
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
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </Card>
          </Grid>

          {/* Informasi Film */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {movie.title}
            </Typography>

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
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Trailer not available.
              </Typography>
            )}

            <Typography variant="h6" color="textSecondary" gutterBottom>
              {movie.release_date} | {movie.runtime} minutes
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Synopsis:</strong> {movie.overview}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Rating:</strong> {movie.vote_average} / 10
            </Typography>

            <Typography variant="h5" gutterBottom>
              Cast
            </Typography>
            <Grid container spacing={2}>
              {movie.credits.cast.slice(0, 5).map((actor) => (
                <Grid item key={actor.id} xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt={actor.name}
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <div>
                      <Typography variant="body1">{actor.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{actor.character}</Typography>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
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
              {/* Potong ulasan jika lebih dari 200 karakter */}
              {review.content.length > 200
                ? `${review.content.slice(0, 200)}...`
                : review.content}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() => console.log(`Reading full review by ${review.author}`)}
            >
              Read Full Review
            </Button>
          </Box>
        ))}

        {/* Add a comment section (Bootstrap) */}
        <section style={{ backgroundColor: '#d94125', marginTop: '30px' }}>
          <div className="container my-5 py-5 text-body">
            <div className="row d-flex justify-content-center">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div className="card">
                  <div className="card-body p-4">
                    <div className="d-flex flex-start w-100">
                      <img className="rounded-circle shadow-1-strong me-3"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp" alt="avatar" width="65"
                        height="65" />
                      <div className="w-100">
                        <h5>Add a comment</h5>
                        <ul className="rating mb-3">
                          <li><i className="far fa-star fa-sm text-danger" title="Bad"></i></li>
                          <li><i className="far fa-star fa-sm text-danger" title="Poor"></i></li>
                          <li><i className="far fa-star fa-sm text-danger" title="OK"></i></li>
                          <li><i className="far fa-star fa-sm text-danger" title="Good"></i></li>
                          <li><i className="far fa-star fa-sm text-danger" title="Excellent"></i></li>
                        </ul>
                        <div className="form-outline">
                          <textarea className="form-control" id="textAreaExample" rows="4"></textarea>
                          <label className="form-label" htmlFor="textAreaExample">What is your view?</label>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <Button className="btn btn-success">Cancel</Button>
                          <Button className="btn btn-danger">
                            Send <i className="fas fa-long-arrow-alt-right ms-1"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </Box>
    </Container>
  );
};

export default Detail;
