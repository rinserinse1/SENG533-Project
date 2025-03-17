import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, Container, TextField, Box } from '@mui/material';
import useAxios from '../api/useAxiosPrivate';
import { Link, useParams } from 'react-router-dom';
import placeholder from './placeholder.png';
import './movieList.css';

const MovieList = () => {
    const axiosPrivate = useAxios();
    const [movieListTrending, setMovieListTrending] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const { pageNumber } = useParams(); 
    const notFound = `/404`;

    useEffect(() => {
        const fetchTrendingData = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            try {
                const { data } = await axiosPrivate.get(`/api/movie/trending?page=${pageNumber}`, config);
                setMovieListTrending(data);
            } catch (error) {
                window.location.href = notFound;

            }
        };
        fetchTrendingData();
    }, [pageNumber]);

    const previousPage = () => {
        if (parseInt(pageNumber, 10) < 500) {
            const nextPageNumber = parseInt(pageNumber) + 1;
            window.scroll(0, 0)
            return `/movielist/page/${nextPageNumber}`;
        }
    };

    const nextPage = () => {
        if (parseInt(pageNumber, 10) > 1) {
            const previousPageNumber = parseInt(pageNumber) - 1;
            window.scroll(0, 0)
            return `/movielist/page/${previousPageNumber}`;
        }
    };

    const handleSearch = () => {
        const searchUrl = `/search/${searchQuery}/page/1`;
        window.location.href = searchUrl;
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const isValidImageUrl = (url) => {
        if (!url) return false; // If URL is null, return false
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Valid image file extensions
        const lowerCaseUrl = url.toLowerCase();
        return validImageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <br /><br />
            <Typography variant="h4" gutterBottom color="white" sx={{ marginBottom: '20px', fontWeight: 'medium', display: 'flex', alignItems: 'center' }} className='fade-in'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5em', flexShrink: 0 }}>
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                Trending
            </Typography>

            <TextField
                id="search"
                label={<span style={{ color: 'white' }}>Search Movies</span>} // Add style to make label white
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                fullWidth
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

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {movieListTrending.map((movie) => (
                    <Link key={movie.id} to={`/movie/${encodeURIComponent(movie.id)}`}>
                        <div className="group relative fade-in">
                            <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-md lg:aspect-w-1 lg:aspect-h-1 group-hover:opacity-75">
                                <img
                                    src={isValidImageUrl(movie.image) ? movie.image : placeholder} // Use placeholder image URL if movie image is null or not a valid image URL
                                    alt={movie.title}
                                    className="object-cover object-center"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm" style={{ color: "white" }}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {movie.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500"></p>
                                </div>
                                <p className="text-sm font-medium text-gray-900"></p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }} className='fade-in'>
                <Button component={Link} to={nextPage()} variant="contained" sx={{ bgcolor: '#4f46e5', color: '#ffffff', '&:hover': { bgcolor: '#4338ca', }, }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </Button>
                <Button component={Link} to={previousPage()} variant="contained" sx={{ bgcolor: '#4f46e5', color: '#ffffff', '&:hover': { bgcolor: '#4338ca', }, }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </Button>
            </div>
        </div>



    );
};

export default MovieList;
