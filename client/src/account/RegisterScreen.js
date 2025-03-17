import { useState, useEffect } from "react";
import { Link as Link2 } from "react-router-dom";
import React, { useContext } from "react";
import "./RegisterScreen.css";
import { jwtDecode } from 'jwt-decode';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RegisterScreen = () => {
  let { user, setUser, authToken, setAuthToken } = useContext(AuthContext);
  const theme = createTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, []);

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await API.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
        },
        config,
        { withCredentials: true }
      );

      localStorage.setItem("authToken", data.accessToken);
      setAuthToken(data.accessToken);
      setUser(jwtDecode(data.accessToken));
      navigate("/");
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
              class="feather feather-user-plus"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </Avatar>
          <Typography component="h1" variant="h5" color={"white"}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={registerHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  label={<span style={{ color: "white" }}>Name</span>}
                  name="name"
                  autoComplete="off"
                  type="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  //autoComplete="email"
                  autoComplete="off"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  //autoComplete="true"
                  autoComplete="off"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Confirm password"
                  label="Confirm Password"
                  type="password"
                  id="confirmpassword"
                  //autoComplete="true"
                  autoComplete="off"
                  placeholder="Confirm password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              </Grid>

              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link2 variant="body2" to="/login" style={{ color: "white" }}>
                  Already have an account? Sign in{" "}
                </Link2>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterScreen;
