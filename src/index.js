import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app.jsx'; // Import the App component


// This is the standard React 18 way to boot the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
