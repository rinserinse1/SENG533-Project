import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const ReviewSchema = new mongoose.Schema({
  movieID: {
    type: Number,
    trim: true,
    
  },
  email: {
    type: String,
    trim: true,
    //unique:false,
  },
  name: {
    type: String,
    trim: true,
    match: /^[a-zA-Z\s]+$/, // Only alphabets and spaces are allowed
  },
  review_description: {
    type: String,
    trim: true,
    maxlength: 2000, // Maximum length of 2000 characters
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
  }
});




const Review = mongoose.model("Review", ReviewSchema);

export default Review;