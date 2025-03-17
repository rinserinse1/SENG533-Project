import express from 'express';
const router = express.Router();
import { getMovieInfoByID, getTrendingList, searchMovies } from "../controllers/movie.js"

router.get('/trending', getTrendingList);
router.post('/moviebyid', getMovieInfoByID);
router.get('/search', searchMovies); // Change to GET method

export default router;
