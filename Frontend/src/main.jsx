import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SKUProvider } from './context/SKUContext.jsx';
import { SalesmanProvider } from './context/SalesmanContext.jsx';
import { PricesProvider } from './context/PricesContext.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';
import { PurchaseProvider } from './context/PurchaseContext.jsx';
import { PrintProvider } from './context/PrintContext.jsx';
import { ExcelProvider } from './context/ExcelContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrintProvider>
        <ExcelProvider>
          <SKUProvider>
            <PricesProvider>
              <SalesmanProvider>
                <PurchaseProvider>
                  <TransactionProvider>
                    <AuthProvider>
                      <App />
                    </AuthProvider>
                  </TransactionProvider>
                </PurchaseProvider>
              </SalesmanProvider>
            </PricesProvider>
          </SKUProvider>
        </ExcelProvider>
      </PrintProvider>
    </BrowserRouter>
  </React.StrictMode>
)
