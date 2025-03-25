import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js"
import Review from "../models/Review.js";
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




  export const addToWatchList= async (req, res, next) => {

    const { movieID } = req.body; 

  
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, options);


      const updatedUser = await User.findOneAndUpdate(
        { _id: decoded.id }, 
        { 
          $push: { 
            watchlist: {
              movieID: movieID, 
              title: response.data.title,
              description: response.data.overview,
              image: "https://image.tmdb.org/t/p/w500/" + response.data.poster_path,
            }
          },
        },
        { new: true } // This option returns the modified document rather than the original one
      );
      res.status(200).json();

    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ErrorResponse("Token expired", 401));
      } else if (err.name === "JsonWebTokenError") {
        return next(new ErrorResponse("Malformed JWT token", 500));
      } else if(err.code === 11000){
        console.log(err)
        return next(new ErrorResponse("Duplicate key error", 409));
      }else {
        return next(new ErrorResponse("Not authorized to access this route", err, 401));
      }
    }
  };



  export const removeFromWatchList= async (req, res, next) => {

    const { movieID } = req.body; 

  
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, options);


      const updatedUser = await User.findOneAndUpdate(
        { _id: decoded.id }, 
        { 
            $pull: { 
                watchlist: { movieID: movieID }
            },
        },
        { new: true } // This option returns the modified document rather than the original one
      );
      res.status(200).json();

    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ErrorResponse("Token expired", 401));
      } else if (err.name === "JsonWebTokenError") {
        return next(new ErrorResponse("Malformed JWT token", 500));
      } else if(err.code === 11000){
        console.log(err)
        return next(new ErrorResponse("Duplicate key error", 409));
      }else {
        return next(new ErrorResponse("Not authorized to access this route", err, 401));
      }
    }
  };



  
  export const getWatchList = async (req, res, next) => {

  
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      const userWatchlist = user.watchlist;
      res.status(200).json({ watchlist: userWatchlist });
      
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ErrorResponse("Token expired", 401));
      } else if (err.name === "JsonWebTokenError") {
        return next(new ErrorResponse("Malformed JWT token", 500));
      } else {
        return next(new ErrorResponse("Not authorized to access this route", err, 401));
      }
    }
  };


  export const getWatchListFaster = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Use projection and lean() to efficiently retrieve only the watchlist field
      const user = await User.findById(decoded.id).select('watchlist').lean();
  
      if (!user) {
        return next(new ErrorResponse("User not found", 404));
      }
  
      res.status(200).json({ watchlist: user.watchlist });
  
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ErrorResponse("Token expired", 401));
      } else if (err.name === "JsonWebTokenError") {
        return next(new ErrorResponse("Malformed JWT token", 500));
      } else {
        return next(new ErrorResponse("Not authorized to access this route", err, 401));
      }
    }
  };