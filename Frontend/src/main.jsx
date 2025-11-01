import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SKUProvider } from './context/SKUContext.jsx';
import { SalesmanProvider } from './context/SalesmanContext.jsx';
import { PricesProvider } from './context/PricesContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SKUProvider>
        <PricesProvider>
          <SalesmanProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </SalesmanProvider>
        </PricesProvider>
      </SKUProvider>
    </BrowserRouter>
  </React.StrictMode>
)
