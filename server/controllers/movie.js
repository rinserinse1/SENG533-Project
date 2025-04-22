import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import axios from "axios";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path"; // Import the path module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

// Reusable axios options with TMDB API key
const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
};

// In-memory cache (key => { data, timestamp })
// We'll store both search results and trending results here.
const cache = new Map();
const CACHE_TTL_MS = 60_000; // 60-second cache expiration

function getCacheKey(...parts) {
  return parts.join("|");
}

export const searchMovies = async (req, res) => {
  const { query, pageNumber } = req.query;
  console.log(`Received search request for query="${query}", page="${pageNumber}"`);

  // 1. Build a unique key for search
  const cacheKey = getCacheKey("search", query, pageNumber);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry) {
    const age = Date.now() - cachedEntry.timestamp;
    if (age < CACHE_TTL_MS) {
      console.log("Returning cached response for", cacheKey);
      return res.status(200).json(cachedEntry.data);
    } else {
      console.log("Cache expired for", cacheKey, "- removing from cache");
      cache.delete(cacheKey);
    }
  }

  // 2. If not cached or expired, fetch from TMDB
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`,
      options
    );
    const movies = response.data.results.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.overview,
      release_date: item.release_date,
      image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
    }));

    // 3. Store in cache
    cache.set(cacheKey, { data: movies, timestamp: Date.now() });
    console.log("Fetched fresh data from TMDB and cached for", cacheKey);

    // 4. Return to client
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "An error occurred while searching movies." });
  }
};

export const getTrendingList = async (req, res) => {
  const { page } = req.query;
  console.log(`Received trending request for page="${page}"`);

  // 1. Build a unique key for trending data
  const cacheKey = getCacheKey("trending", page);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry) {
    const age = Date.now() - cachedEntry.timestamp;
    if (age < CACHE_TTL_MS) {
      console.log("Returning cached trending data for", cacheKey);
      return res.status(200).json(cachedEntry.data);
    } else {
      console.log("Cache expired for", cacheKey, "- removing from cache");
      cache.delete(cacheKey);
    }
  }

  // 2. If not cached or expired, fetch from TMDB
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      options
    );
    // Convert the results to your preferred structure
    const trending = response.data.results.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.overview,
      release_date: item.release_date,
      image: "https://image.tmdb.org/t/p/w500/" + item.poster_path,
    }));

    // 3. Store in cache
    cache.set(cacheKey, { data: trending, timestamp: Date.now() });
    console.log("Fetched fresh trending data from TMDB and cached for", cacheKey);

    // 4. Return to client
    res.status(200).json(trending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getMovieInfoByID = async (req, res) => {
  const { id } = req.body;
  console.log(`Received movie info request for ID="${id}"`);

  axios
    .get(`https://api.themoviedb.org/3/movie/${id}`, options)
    .then(async (response) => {
      // Fetch videos
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      );
      const videos = videoResponse.data.results;
      // Filter out videos to find a trailer
      const trailer = videos.find((video) => video.type === "Trailer");
      const videoKey = trailer ? trailer.key : null;
      const genres = response.data.genres.map((genre) => genre.name);

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
        genres: genres,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
};

// import ErrorResponse from "../utils/errorResponse.js";
// import User from "../models/User.js"
// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler"
// import axios from "axios";
// import * as dotenv from 'dotenv'
// import { fileURLToPath } from 'url';
// import path from 'path'; // Import the path module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({
//   path: path.join(__dirname ,'..', '.env') 
// });

// const options = {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': `Bearer ${process.env.API_KEY}`
//     }
//   };



// export const searchMovies = async (req, res) => {
//   const { query, pageNumber } = req.query; // Extract pageNumber from the query parameters
//   try {
//     const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, options);
//     const movies = response.data.results.map(item => ({
//       id: item.id,
//       title: item.title,
//       description: item.overview,
//       release_date: item.release_date,
//       image: `https://image.tmdb.org/t/p/w500/${item.poster_path}`
//     }));
//     res.status(200).json(movies);
//   } catch (error) {
//     console.error('Error searching movies:', error);
//     res.status(500).json({ error: 'An error occurred while searching movies.' });
//   }
// };


// export const getTrendingList= async (req, res) => {
//   const { page } = req.query;
//   axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options)         
//     .then(response => {
//         //console.log(response.data)
//         res
//         .status(200)
//         .json(
//           response.data.results.map((item) => ({
//             id: item.id,
//             title: item.title,
//             description: item.overview,
//             release_date: item.release_date,
//             image: "https://image.tmdb.org/t/p/w500/" + item.poster_path,
//           }))
//         );
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred' });
//     });

//   };




//   export const getMovieInfoByID = async (req, res) => {
//     const { id } = req.body;
//     axios.get(`https://api.themoviedb.org/3/movie/${id}`, options)
//     .then(async response => {
//         //console.log(response.data);
//         // Fetch videos related to the movie
//         const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);
//         const videos = videoResponse.data.results;
//         // Filter out videos to find the trailer
//         const trailer = videos.find(video => video.type === "Trailer");
//         // Take the first video key if available
//         const videoKey = trailer ? trailer.key : null;
//         const genres = response.data.genres.map(genre => genre.name);


//         res.status(200).json({
//             id: response.data.id,
//             title: response.data.title,
//             description: response.data.overview,
//             release_date: response.data.release_date,
//             image: "https://image.tmdb.org/t/p/w500/" + response.data.poster_path,
//             background: "https://image.tmdb.org/t/p/original/" + response.data.backdrop_path,
//             video: videoKey,
//             budget: response.data.budget,
//             revenue: response.data.revenue,
//             length: response.data.runtime,
//             genres: genres
//         });
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred' });
//     });
// };
