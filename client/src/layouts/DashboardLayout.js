import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import React, { Component }  from 'react';
import Header from "./header"
// ----------------------------------------------------------------------


const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,

  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {

  const [open, setOpen] = useState(false);


  return (
    <StyledRoot>

      <Header onOpenNav={() => setOpen(true)} />
 
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
