import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"
import axios from "axios";
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path from 'path'; // Import the path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname ,'..', '.env') 
});

const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  };



export const searchMovies = async (req, res) => {
  const { query, pageNumber } = req.query; // Extract pageNumber from the query parameters
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, options);
    const movies = response.data.results.map(item => ({
      id: item.id,
      title: item.title,
      description: item.overview,
      release_date: item.release_date,
      image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`
    }));
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'An error occurred while searching movies.' });
  }
};


export const getTrendingList= async (req, res) => {
  const { page } = req.query;
  axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options)         
    .then(response => {
        //console.log(response.data)
        res
        .status(200)
        .json(
          response.data.results.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.overview,
            release_date: item.release_date,
            image: "https://image.tmdb.org/t/p/w500/" + item.poster_path,
          }))
        );
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    });

  };




  export const getMovieInfoByID = async (req, res) => {
    const { id } = req.body;
    axios.get(`https://api.themoviedb.org/3/movie/${id}`, options)
    .then(async response => {
        //console.log(response.data);
        // Fetch videos related to the movie
        const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);
        const videos = videoResponse.data.results;
        // Filter out videos to find the trailer
        const trailer = videos.find(video => video.type === "Trailer");
        // Take the first video key if available
        const videoKey = trailer ? trailer.key : null;
        const genres = response.data.genres.map(genre => genre.name);


        res.status(200).json({
            id: response.data.id,
            title: response.data.title,
            description: response.data.overview,
            release_date: response.data.release_date,
            image: "https://image.tmdb.org/t/p/w500/" + response.data.poster_path,
            background: "https://image.tmdb.org/t/p/original/" + response.data.backdrop_path,
            video: videoKey,
            budget: response.data.budget,
            revenue: response.data.revenue,
            length: response.data.runtime,
            genres: genres
        });
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    });
};
