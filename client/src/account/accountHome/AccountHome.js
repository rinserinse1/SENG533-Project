import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Grid, Divider } from "@mui/material";
import useAxios from "../../api/useAxiosPrivate";
import { Link } from "react-router-dom";

const AccountHome = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const axiosPrivate = useAxios();

  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Movies per page
  const moviesPerPage = 4;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = reviewedMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  /**
   * Change pages with movies that have been reviewed
   */
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  /**
   * Gets all movies reviewed by the account when the page is loaded/refreshed
   */
  useEffect(() => {
    const fetchReviewedMovies = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axiosPrivate.get(
          "/api/review/getuserreviews",
          config
        );
        setReviewedMovies(data.reviews);
      } catch (error) {
        setError("Failed to fetch reviewed movies.");
      }
    };
    fetchReviewedMovies();
  }, []);

  /**
   * Gets account information
   */
  useEffect(() => {
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axiosPrivate.get("/api/auth/info", config, {
          withCredentials: true,
        });
        setEmail(data.user.email);
        setName(data.user.name);
      } catch (error) {
        setError("Error fetching status:", error);
      }
    };

    fetchPrivateData();
  }, []);

  return (
    <Container>
      <br />
      <br />
      <Typography
        variant="h4"
        gutterBottom
        color="white"
        sx={{
          marginBottom: "0.1em",
          fontWeight: "medium",
          display: "flex",
          alignItems: "center",
        }}
        className="fade-in"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ marginRight: "0.5em", flexShrink: 0 }}
          class="feather feather-user"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Profile
      </Typography>

      <Divider sx={{ backgroundColor: "#475569" }}></Divider>

      <Typography
        variant="h5"
        gutterBottom
        color="white"
        sx={{
          marginTop: "0.5em",
          marginBottom: "0.2em",
          fontWeight: "regular",
          display: "flex",
          alignItems: "center",
        }}
        className="fade-in"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ marginRight: "0.5em", flexShrink: 0 }}
          class="feather feather-activity"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        Activity
      </Typography>

      <Grid container spacing={3} className="fade-in">
        {currentMovies.map((movie) => (
          <Grid item xs={3} key={movie.movieID}>
            <Link
              to={`/movie/${movie.movieID}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                style={{ borderRadius: "0.375rem" }}
                src={movie.image}
                alt={movie.title}
              />
              <h3 style={{ color: "white" }}>{movie.title}</h3>
            </Link>
          </Grid>
        ))}
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
        className="fade-in"
      >
        <Button
          disabled={currentPage === 1}
          onClick={prevPage}
          sx={{
            bgcolor: "#4f46e5",
            color: "#ffffff",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-left"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </Button>
        <Button
          disabled={currentMovies.length < moviesPerPage}
          onClick={nextPage}
          sx={{
            bgcolor: "#4f46e5",
            color: "#ffffff",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-right"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Button>
      </div>
    </Container>
  );
};

export default AccountHome;
