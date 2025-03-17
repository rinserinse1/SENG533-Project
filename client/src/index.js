import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css'
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(

    <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
   
); 