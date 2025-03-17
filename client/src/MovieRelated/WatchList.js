import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Rating } from '@mui/material';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import useAxios from '../api/useAxiosPrivate';

const WatchList = () => {
    const axiosPrivate = useAxios();
    const [watchListWithAvgScores, setWatchListWithAvgScores] = useState([]);
    const [error, setError] = useState("");
    const [watchlisttrigger, setwatchlisttrigger] = useState("");

    useEffect(() => {
        const fetchWatchList = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            console.log("made it 2")
            try {
                const { data } = await axiosPrivate.get("/api/watchlist/getwatchlist", config);
                const watchlistWithAvgScores = await Promise.all(data.watchlist.map(async movie => {
                    const { data: { reviews } } = await axiosPrivate.post("/api/review/getmoviereviews", { movieID: movie.movieID }, config);
                    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
                    const averageStars = reviews.length === 0 ? 0 : totalStars / reviews.length;
                    return { ...movie, averageStars };
                }));
                setWatchListWithAvgScores(watchlistWithAvgScores);
                console.log(watchlistWithAvgScores);
            } catch (error) {
                setError("Failed to fetch watch list.");
            }
        };
        fetchWatchList();
    }, [watchlisttrigger]);


    const watchlistRemove = async (e, movieID) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };
        console.log("made it")
        try {
            await axiosPrivate.post("/api/watchlist/removewatchlist", { movieID }, config);
            setwatchlisttrigger("activate")
        } catch (error) {

        }
    };

    return (
        
        <Container>
            <br /><br />
            <Typography variant="h4" gutterBottom color="white" sx={{ marginBottom: '20px', fontWeight: 'medium', display: 'flex', alignItems: 'center' }} className='fade-in'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '0.5em', flexShrink: 0 }} class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Watchlist
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b' }} className='fade-in'>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large" }}>Movie</TableCell>
                            <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large", textAlign: "center" }}>Stars</TableCell>
                            <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large" }}>Action</TableCell>
                            <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large" }}>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {watchListWithAvgScores.map((movie, index) => (
                            <TableRow key={movie.movieID} style={{ backgroundColor: index % 2 === 0 ? '#334155' : '#1e293b' }}>
                                <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large" }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={movie.image} alt={movie.title} style={{ width: '50px', height: '75px', marginRight: '10px', borderRadius: '4px' }} />
                                        <h3>{movie.title}</h3>
                                    </div>
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: "none", fontSize: "large", textAlign: 'center' }}>
                                    <Rating name="read-only" value={movie.averageStars} precision={0.1} readOnly sx={{
                                        '& .MuiRating-iconEmpty': {
                                        color: 'white', 
                                    },
                                        '& .MuiRating-iconFilled': {
                                    },
                            }} />
                                </TableCell>
                                <TableCell sx={{ color: 'white', borderBottom: "none" }}>
                                    <Button
                                        sx={{ bgcolor: '#4f46e5', color: '#ffffff', '&:hover': { bgcolor: '#4338ca', }, fontSize: "medium" }}
                                        component={Link}
                                        to={`/movie/${movie.movieID}`}
                                        variant='contained'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-film"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                                    </Button>
                                </TableCell>


                                <TableCell sx={{ color: 'red', borderBottom: "none" }}>
                                    <Button
                                        sx={{ bgcolor: '#f43f5e', color: '#ffffff', '&:hover': { bgcolor: '#e11d48', }, }}
                                        variant='contained'
                                        onClick={(e) => watchlistRemove(e, movie.movieID)}
                                    >
                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
          </TableContainer>
        </Container>
    );
};

export default WatchList;