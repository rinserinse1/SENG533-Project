import { useState, useEffect } from "react";
import { Link as Link2 } from "react-router-dom";
import React, { useContext } from "react";
import "./LoginScreen.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { API } from "../api";
import { jwtDecode } from 'jwt-decode';

const LoginScreen = () => {
  let { setUser, setAuthToken } = useContext(AuthContext);

  const navigate = useNavigate();
  const theme = createTheme();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await API.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true },
        config
      );
      localStorage.setItem("authToken", data.accessToken);
      setAuthToken(data.accessToken);
      setUser(jwtDecode(data.accessToken));
      navigate("/movielist/page/1");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="fade-in">
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#4f46e5", width: 64, height: 64 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-lock"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </Avatar>
          <Typography component="h1" variant="h5" color={"white"}>
            Login
          </Typography>
          <Box component="form" onSubmit={loginHandler} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label={<span style={{ color: "white" }}>Email</span>}
              type="email"
              id="email"
              autoComplete="off"
              placeholder="Enter email address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              tabIndex={1}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white" },
                classes: {
                  root: "white-textfield-root",
                  focused: "white-textfield-focused",
                  notchedOutline: "white-textfield-notchedOutline",
                },
                form: {
                  autoComplete: "off",
                },
              }}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                    {
                      "-webkit-text-fill-color": "white", // Ensures text color is white
                      "-webkit-box-shadow":
                        "0 0 0 30px #1e293b inset !important", // Adjusts autofill background color
                      transition: "background-color 5000s ease-in-out 0s", // Adds a long transition to prevent autofill background color changes
                    },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={<span style={{ color: "white" }}>Password</span>}
              type="password"
              id="password"
              autoComplete="off"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              tabIndex={2}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white" },
                classes: {
                  root: "white-textfield-root",
                  focused: "white-textfield-focused",
                  notchedOutline: "white-textfield-notchedOutline",
                },
              }}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                    {
                      "-webkit-text-fill-color": "white", // Ensures text color is white
                      "-webkit-box-shadow":
                        "0 0 0 30px #1e293b inset !important", // Adjusts autofill background color
                      transition: "background-color 5000s ease-in-out 0s", // Adds a long transition to prevent autofill background color changes
                    },
                },
              }}
            />

            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#4f46e5",
                color: "#ffffff",
                "&:hover": { bgcolor: "#4338ca" },
                fontSize: "medium",
              }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Link2
                  to="/register"
                  variant="body2"
                  style={{ color: "white" }}
                >
                  Don't have an account? Sign up
                </Link2>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginScreen;
