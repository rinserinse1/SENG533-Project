import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Button } from '@mui/material';
import AccountPopover from './AccountPopover';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useContext } from 'react';
import Divider from "@mui/material/Divider";
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material/';
import AuthContext from '../../context/AuthContext';

const HEADER_HEIGHT = 100; // Adjusted height for mobile screens

export function bgBlur(props) {
  const color = '#4f46e5';
  const blur = 6;
  const opacity = 0.8;
  const imgUrl = imgUrl;

  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&:before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  width: '100%', // Make the header full width
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_HEIGHT,
  padding: theme.spacing(0, 1), // Adjusted padding for mobile screens
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Add space between items
}));

const TitleBox = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
});

export default function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const isMiniScreen = useMediaQuery('(max-width:700px)');

  return (
    <StyledRoot>
      <StyledToolbar>
        <Box display="flex" alignItems="center">
        <Typography
            style={{
              color: '#ffffff',
              textTransform: 'none',
              fontSize: isMiniScreen ? '20px' : '25px',
              textAlign: 'center', // Center the title
              fontWeight: 'bold',
              marginRight: isMiniScreen ? "10px" : "20px", // Adjust margin for smaller screens
            }}
          >
            <h1>MVC</h1>
          </Typography>
        </Box>
        <TitleBox>
        </TitleBox>
        <Box>
        <Button
            component={Link}
            to="/"
            sx={{
              width: 64, height: 64,
              color: "#ffffff",
              textTransform: "none",
              fontSize: isMiniScreen ? '14px' : '16px', // Adjust font size for smaller screens
              fontWeight: "regular",
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'none',
              },
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </Button>
          <Button
            component={Link}
            to="/watchList"
            sx={{
              width: 64, height: 64,
              color: "#ffffff",
              textTransform: "none",
              fontSize: isMiniScreen ? '14px' : '16px', // Adjust font size for smaller screens
              fontWeight: "regular",
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'none',
              },
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </Button>
          {user ? (
            <AccountPopover />
          ) : (
            <Button
              component={Link}
              to="/login"
              style={{
                color: "#ffffff",
                textTransform: "none",
                fontSize: isMiniScreen ? '10px' : '20px',
                textDecoration: "none",
                fontWeight: "regular",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            </Button>
          )}
        </Box>
      </StyledToolbar>
      <Divider />
    </StyledRoot>
  );
}
