import express from 'express';
const router = express.Router();
import {addToWatchList,getWatchList,removeFromWatchList, getWatchListFaster  } from "../controllers/watchlist.js"

router.post('/addwatchlist',addToWatchList);
router.post('/removewatchlist', removeFromWatchList);
router.get('/getwatchlist', getWatchList);
router.get('/getwatchlistfaster', getWatchListFaster);


export default router;
