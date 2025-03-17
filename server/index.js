import * as dotenv from 'dotenv'
import express  from "express";
import bodyParser from "body-parser";
import mongoose  from "mongoose";
import cors from "cors";
import axios from 'axios';
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import reviewRoutes from "./routes/review.js"
import watchlistRoutes from "./routes/watchlist.js"
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser"
import { fileURLToPath } from 'url';
import path from 'path'; // Import the path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, '.', '.env') 
});



//SET UP
const app = express();
app.use(cookieParser())
const corsOptions = {
  origin: ["http://localhost:3000"], // Allow requests from localhost
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // Include cookies in CORS requests if needed
  optionsSuccessStatus: 204, // Respond to preflight requests with 204 (No Content)
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
//SET UP COMPLETE

app.get("/", (req, res, next) => { //BASIC TEST, NOT USED

  res.send("Api running");

});



//SETTING ROUTES (!!!)
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);


app.use(errorHandler);  //MIDDLE WARE



//CONNECTING TO DATABASE
const CONNECTION_URL = process.env.DATABASE_CONNECTION;
const PORT = process.env.PORT || 5001;
mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT} `)))
    .catch((error) => console.log(error.message));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
});