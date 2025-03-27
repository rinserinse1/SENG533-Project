import express from 'express';
const router = express.Router();
import { makeReview, deleteReview, getReviewsForMovie, getReviewsForUser, makeReviewFaster } from "../controllers/review.js"

router.post('/makereview', makeReview);

router.post('/makereviewfaster', makeReviewFaster);
router.post('/deletereview', deleteReview);
router.post('/getmoviereviews', getReviewsForMovie);
router.get('/getuserreviews', getReviewsForUser);


export default router;
