import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Divider, IconButton, Menu, MenuItem, Typography, ListItemIcon, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthContext from '../../context/AuthContext';
import useAxios from '../../api/useAxiosPrivate';

export default function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logoutUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const axiosPrivate = useAxios();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logoutUser();
  };

  useEffect(() => {
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axiosPrivate.get("/api/auth/info", config, { withCredentials: true });
        setEmail(data.user.email);
        setName(data.user.name);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchPrivateData();
  }, []);

  return (
    <>
      <Button
        id="account-icon"
        aria-controls="account-menu"
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        onClick={handleOpen}
        sx={{ m: 1, width: 64, height: 64, color: "white" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </Button>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: '250px',
            backgroundColor: '#1e293b', // Change the background color here
            '& .MuiMenuItem-root':{
              '&:hover':{
                bgcolor: '#334155',
              }
            }
          },
        }}
      >
        <Typography variant="h5" sx={{ pl: 1, color: 'white' }}>{name}</Typography>
        <Typography variant="subtitle2" sx={{ pl: 1, pb: 1, color: 'white' }}>{email}</Typography>
        <Divider sx={{ backgroundColor: '#475569' }}></Divider>
        <MenuItem onClick={handleClose} component={Link} to="/youraccount" sx={{ color: 'white' }}>
        <ListItemIcon sx={{ color: 'white' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </ListItemIcon>
          <Typography variant="inherit" >Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
        <ListItemIcon sx={{ color: 'white' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
