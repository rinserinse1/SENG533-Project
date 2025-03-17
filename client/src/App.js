import { AuthProvider } from './context/AuthContext';
import MovieHome from './MovieRelated/MovieHome';
import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, useLocation, useRoutes } from "react-router-dom";
import LoggedRoutes from './PrivateRoutes/LoggedRoute';
import Error from "./notFound/NotFound";
import DashboardLayout from './layouts';
import MovieList from './MovieRelated/MovieList';
import WatchList from './MovieRelated/WatchList';
import AccountHome from './account/accountHome/AccountHome';
import LoginScreen from "./account/LoginScreen";
import RegisterScreen from "./account/RegisterScreen";
import SearchMovie from './MovieRelated/SearchMovie'; // Import the new component for search

const App = () => {

  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '',
          element: <Navigate to="/movielist/page/1" replace />,
        },
        {
          path: 'movie',
          element: <MovieHome />,
          children: [
            {
              path: ':id',
              element: <MovieHome />
            }
          ],
        },
        {
          path: 'movielist',
          element: <MovieList />,
          children: [
            {
              path: 'page/:pageNumber', // Dynamic parameter for page number
              element: <MovieList />
            },
          ],
        },
        {
          path: 'search/:movieName', // New route for searching by movie name
          element: <SearchMovie />,
          children: [
            {
              path: 'page/:pageNumber', // Dynamic parameter for page number
              element: <SearchMovie />
            },
          ],
        },
        {
          path: 'register',
          element: <RegisterScreen />
        },
        {
          path: 'login',
          element: <LoginScreen />
        },
        {
          element: <LoggedRoutes />,
          children: [
            {
              path: 'YourAccount',
              element: <AccountHome />
            },
            {
              path: 'watchList',
              element: <WatchList />
            },
          ]
        },
        {
          path: '404',
          element: <Error />
        },
        {
          path: '*',
          element: <Navigate to="/404" replace />,
        },
      ],
    },
  ]);

  return (
    <div>
      <AuthProvider>
        {routes}
      </AuthProvider>
    </div>
  );
}

export default App;
