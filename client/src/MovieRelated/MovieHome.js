import React, { useState, useEffect, useContext } from 'react';
import { Paper, Typography, Button, Container, TextField, Rating, Grid, Chip, Box, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import useAxios from '../api/useAxiosPrivate';
import AuthContext from '../context/AuthContext';
import placeholder from './placeholder.png';

const MovieHome = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []); 

  const { id } = useParams();
  const movieID = id;
  const axiosPrivate = useAxios();
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [movieInfo, setMovieInfo] = useState({});
  const [stars, setStars] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewtrigger, setreviewtrigger] = useState("");
  const { user } = useContext(AuthContext);
  const [averageStars, setAverageStars] = useState(0);
  const [userReviewed, setUserReviewed] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlisttrigger, setwatchlisttrigger] = useState("");
  const notFound = `/404`;

  const handleRatingChange = (event, newValue) => {
      setStars(newValue);
  };

  const reviewSubmit = (e, description) => {
      e.preventDefault();
      const config = {
          headers: {
              "Content-Type": "application/json",
          },
      };

      try {
          console.log(id)
          const { data } = axiosPrivate.post("/api/review/makereview", { movieID, description, stars }, config);
          setReviews([...reviews, { email: email, movieID: movieID, review_description: description, stars: stars, name: name, _id: user.id }]);
          const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0) + stars;
          const average = totalStars / (reviews.length+1);
          console.log(average)
          console.log(totalStars)
          if (reviews.length == 0) {
              setAverageStars(average);
          }
          else {
              setAverageStars(average);
          }

      } catch (error) {
          setTimeout(() => {
              setError("");
          }, 5000);
      }


  };

  const handleDeleteReview = (movieID) => {
      const reviewToDelete = reviews.find(review => review.email === email);
      const updatedReviews = reviews.filter(review => review.email !== email);
      try {

          setReviews(updatedReviews)
          const totalStars = updatedReviews.reduce((acc, review) => acc + review.stars, 0);
          const average = totalStars / (updatedReviews.length);
          if (reviews.length == 0) {
              setAverageStars(0);
          }
          else {
              setAverageStars(average);
          }

          const { data } = axiosPrivate.post("/api/review/deletereview", { movieID });


      } catch (error) {
          console.error("Error deleting review:", error);
          setReviews([...updatedReviews, reviewToDelete]);
      }
  };

  useEffect(() => {
      console.log("Average stars changed:", averageStars);
  }, [averageStars]);

  
  useEffect(() => {
      const fetchMovieInfo = async () => {
          const config = {
              headers: {
                  "Content-Type": "application/json",
              },
          };
          try {
              const { data } = await axiosPrivate.post("/api/movie/moviebyid", { id }, config);
              setMovieInfo(data);
          } catch (error) {
              setError("An error occurred while fetching movie information.");
              window.location.href = notFound;
          }
      };
      fetchMovieInfo();
  }, [id]);


  useEffect(() => {
      const fetchMovieReviews = async () => {
          const config = {
              headers: {
                  "Content-Type": "application/json",
              },
          };
          try {

              console.log("made it")
              const { data } = await axiosPrivate.post("/api/review/getmoviereviews", { movieID }, config);
              setReviews(data.reviews);
              console.log(data.reviews)
              const totalStars = data.reviews.reduce((acc, review) => acc + review.stars, 0);
              const average = totalStars / data.reviews.length;
              if (data.reviews.length == 0) {
                  setAverageStars(0);
              }
              else {
                  setAverageStars(average);
              }


          } catch (error) {
              setError("An error occurred while fetching movie reviews.");
          }
      };

      fetchMovieReviews();
  }, [reviewtrigger]);

  useEffect(() => {
      const fetchPrivateData = async () => {
          const config = {
              headers: {
                  "Content-Type": "application/json",
              },
          };
          try {
              const { data } = await axiosPrivate.get("/api/auth/info", config, { withCredentials: true });
              setEmail(data.user.email);
              setName(data.user.name);
          } catch (error) {
              console.error("Error fetching status:", error);
          }
      };

      fetchPrivateData();
  }, []);

  useEffect(() => {
      const isUserReviewed = reviews.some(review => review.email === email);
      setUserReviewed(isUserReviewed);
  }, [reviews, email]);


  useEffect(() => {
    const fetchWatchlist = async () => {
        try {
            const { data } = await axiosPrivate.get("/api/watchlist/getwatchlist");
            const wList = data.watchlist;
            const wListIds = wList.map((movie) => movie.movieID)
            
            if (wListIds.includes(Number(movieID))) {
                setIsInWatchlist(true);
            } else {
                setIsInWatchlist(false);
            }
        } catch (error) {
            setError("An error occurred while fetching watchlist.");
        }
    };
    fetchWatchlist();
  }, [watchlisttrigger]);

  const watchlistSubmit = async (e) => {
    e.preventDefault();

    const config = {
        header: {
            "Content-Type": "application/json",
        },
    };

    try {

        if (isInWatchlist) {
            const { data } = await axiosPrivate.post("/api/watchlist/removewatchlist", { movieID }, config);
            setIsInWatchlist(false);
            console.log("made it remove")
        } else {
            const { data } =await axiosPrivate.post("/api/watchlist/addwatchlist", { movieID }, config);
            setIsInWatchlist(true);
            console.log("made it add")
        }

    } catch (error) {
    }
  };

  const getButtonLabel = () => {
    return isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist";
};

const getButtonIcon = () => {
    return isInWatchlist ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
};

const isValidImageUrl = (url) => {
    if (!url) return false; // If URL is null, return false
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Valid image file extensions
    const lowerCaseUrl = url.toLowerCase();
    return validImageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};

useEffect(() => {
    // Set the background image of the body
    const body = document.querySelector('body');
    if (body) {
        body.style.backgroundImage = `url(${movieInfo.background})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'center';
        body.style.backgroundColor = '#0f172a';
        body.style.backgroundBlendMode = 'overlay';
    }
    // Clean up function to remove the background image when component unmounts
    return () => {
        if (body) {
            body.style.backgroundImage = 'none';
        }
    };
}, [movieInfo.background]);

const genresChips = movieInfo.genres && movieInfo.genres.map((genre, index) => (
    <Chip key={index} label={genre} color="primary" className='fade-in' sx={{ bgcolor: '#4f46e5', mr: 1, mb: 1, mt: 1 }} />
));

// Helper function to format budget and revenue
const formatAmount = (amount) => {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + "B";
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + "M";
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + "K";
    }
    return amount;
};

const isMobile = useMediaQuery('(max-width:600px)'); // Check if viewport width is less than or equal to 600px
const movieTitleVariant = isMobile ? 'h3' : 'h2';

function col_num() {
    if (isMobile) {
        return 16;
    } else {
        return 8;
    }
}

function pad_num() {
    if (isMobile) {
        return 0;
    } else {
        return 2;
    }
}

const getYouTubeVideoDimensions = () => {
    if (isMobile) {
        return {
            width: "100%", // Adjust width to fit mobile screen
            height: "200", // Set a smaller height for mobile
        };
    } else {
        return {
            width: "560", // Default width for non-mobile
            height: "315", // Default height for non-mobile
        };
    }
};

return (
    <Container>
        <br /><br />
        <Grid container spacing={pad_num()} columns={16}>
            <Grid color='white' xs={col_num()}  style={{ textAlign: isMobile ? 'center' : 'initial' }}>
            {isMobile && <br />}
                <Typography variant={movieTitleVariant} color="white" className='fade-in' sx={{ fontWeight: 'light' }}>{movieInfo.title}</Typography>
                <hr gutterBottom className='fade-in'></hr>
                <Grid container spacing={2} alignItems="center" pt={'0.2rem'} className='fade-in' >
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" color="white" className='fade-in'>{movieInfo.release_date}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" color="white" className='fade-in'>{movieInfo.length} minutes</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Rating name="read-only" value={averageStars} precision={0.1} readOnly sx={{
                            '& .MuiRating-iconEmpty': {
                                color: 'white', // Set the color of empty stars
                            },
                            '& .MuiRating-iconFilled': {
                            },
                        }} />
                    </Grid>
                </Grid>
                {genresChips}
                <Typography variant="body1" color="white" className='fade-in' gutterBottom>{movieInfo.description}</Typography>
                {movieInfo.video && (
                    <iframe
                        width={getYouTubeVideoDimensions().width}
                        height={getYouTubeVideoDimensions().height}
                        src={`https://www.youtube.com/embed/${movieInfo.video}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '10px' }}
                        className='fade-in'
                    ></iframe>
                )}
                <Box pt={'0.5rem'}>
                    <Chip label={`Budget: ${"$" + formatAmount(movieInfo.budget)}`} sx={{ bgcolor: '#f43f5e', color: 'white', mr: 1, mb: 1 }} className='fade-in' />
                    <Chip label={`Revenue: ${"$" + formatAmount(movieInfo.revenue)}`} sx={{ bgcolor: '#22c55e', color: 'white', mr: 1, mb: 1 }} className='fade-in' />
                </Box>
                <br></br>
                <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={(e) => { watchlistSubmit(e); }}
                        sx={{
                            bgcolor: isInWatchlist ? '#f43f5e' : '#4f46e5', // #f43f5e if in watchlist, #4f46e5 otherwise
                            color: '#ffffff',
                            '&:hover': {
                                bgcolor: isInWatchlist ? '#e11d48' : '#4338ca', // Adjust hover color accordingly
                            },
                        }}
                        className='fade-in'
                        startIcon={isInWatchlist ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        )}
                    >
                        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    </Button>
                </Container>

            </Grid>
            {!isMobile && (
                <Grid color='white' xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={isValidImageUrl(movieInfo.image) ? movieInfo.image : placeholder} // Use placeholder image URL if movie image is null or not a valid image URL
                        alt={movieInfo.title}
                        className="object-cover object-center fade-in"
                        style={{ borderRadius: '0.375rem', maxWidth: '25rem' }}
                    />
                </Grid>
            )}
        </Grid>

        <br></br><br></br>

        {!userReviewed && (
            <div>
                {/* Text box for user comment */}
                <Typography variant="h4" gutterBottom color="white" sx={{ marginBottom: '20px', fontWeight: 'normal', display: 'flex', alignItems: 'center' }} className='fade-in'>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '0.5em', flexShrink: 0 }} class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Write a Critique
        </Typography>
                <Rating
                    name="user-rating"
                    value={stars}
                    onChange={handleRatingChange}
                    precision={1}
                    sx={{
                        '& .MuiRating-iconEmpty': {
                            color: 'white', // Set the color of empty stars
                        },
                        '& .MuiRating-iconFilled': {
                        },
                    }}
                    className='fade-in'
                />
                <TextField
                    label={<span style={{ color: 'white' }}>Critique Description</span>}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    inputProps={{ maxLength: 1999 }}
                    sx={{
                        input: { color: 'white', borderColor: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                            '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                                '-webkit-text-fill-color': 'white', // Ensures text color is white
                                '-webkit-box-shadow': '0 0 0 30px #1e293b inset !important', // Adjusts autofill background color
                                transition: 'background-color 5000s ease-in-out 0s', // Adds a long transition to prevent autofill background color changes
                            },
                        },
                    }}
                    InputProps={{
                        style: { color: 'white' }
                    }}
                    className='fade-in'
                />
                <br></br><br></br>
                {user ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => reviewSubmit(e, description)}
                        sx={{ bgcolor: '#4f46e5', color: '#ffffff', '&:hover': { bgcolor: '#4338ca' } }}
                        className='fade-in'
                    >
                        Submit Review
                    </Button>
                    ) : (
                    <Button
                        disableElevation
                        disableRipple
                        variant="raised"
                        color="primary"
                        
                        sx={{ bgcolor: '#808080', color: '#ffffff','&:hover': { bgcolor: '#808080' } } }
                        
                    >
                        Login To Submit Review
                    </Button>
                    )}
            </div>
        )}

        {/* Rating selector */}
        <br></br><hr></hr><br></br>
        <Typography variant="h4" gutterBottom color="white" sx={{ marginBottom: '20px', fontWeight: 'medium', display: 'flex', alignItems: 'center' }} className='fade-in'>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '0.5em', flexShrink: 0 }} class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Critiques
        </Typography>

        {reviews.length === 0 && (
<Typography variant="body1" color="white" className='fade-in'>
    No critiques yet for this movie. Be the first!
</Typography>
)}

        {reviews.map(review => (
            <Paper sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 2, overflow: 'hidden', wordWrap: 'break-word' }} key={review._id} style={{ padding: 20, marginBottom: 20 }} className='fade-in'>
                <Typography variant="h6" color={'white'} className='fade-in'>{review.name}</Typography>
                <Rating name="read-only" value={review.stars} readOnly className='fade-in' sx={{
                        '& .MuiRating-iconEmpty': {
                            color: 'white', // Set the color of empty stars
                        },
                        '& .MuiRating-iconFilled': {
                        },
                    }} />
                <Typography variant="body1" color={'white'} className='fade-in'>{review.review_description}</Typography>
                <br></br>
                {/* Add a delete button for each review */}
                {email === review.email && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteReview(review.movieID)}
                        sx={{ bgcolor: '#f43f5e', color: '#ffffff', '&:hover': { bgcolor: '#e11d48', }, }}
                        startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                        className='fade-in'
                    >
                        Delete
                    </Button>
                )}
            </Paper>
        ))}
    </Container>
)
};

export default MovieHome;
  