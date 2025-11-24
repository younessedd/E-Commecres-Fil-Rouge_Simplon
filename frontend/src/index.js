// =============================================
// I SMELL SHOP - React Application Entry Point
// Powered by React 18
// =============================================

// Core React imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Main App component (perfume store frontend)
import App from './App';

// Create the root rendering container
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application inside the root container with StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);