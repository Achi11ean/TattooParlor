import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx'; // Adjust path if needed
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </StrictMode>,
);
