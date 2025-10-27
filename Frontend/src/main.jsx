import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SKUProvider } from './context/SKUContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SKUProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SKUProvider>
    </BrowserRouter>
  </React.StrictMode>
)
