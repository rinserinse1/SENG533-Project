import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        overflow: 'hidden', // Hide overflow to prevent scrollbars
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography variant="h1" sx={{ color: '#4f46e5', mb: 2 , fontWeight: 'bold'}}>
                404
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                The page you’re looking for doesn’t exist.
              </Typography>
              <Button variant="contained" component={Link} to={'/'} sx={{ bgcolor: '#4f46e5', color: '#ffffff', '&:hover': { bgcolor: '#4338ca' } }}>
                Back Home
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
