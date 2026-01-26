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
import { SalesmanModalProvider } from './context/SalesmanModalContext.jsx';
import { DepoProvider } from './context/depoContext.jsx';
import { ItemModalProvider } from './context/ItemModalContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DepoProvider>
        <AuthProvider>
          <SalesmanProvider>
            <SalesmanModalProvider>
                <PrintProvider>
                  <ExcelProvider>
                    <SKUProvider>
              <ItemModalProvider>
                      <PricesProvider>

                        <PurchaseProvider>
                          <TransactionProvider>

                            <App />

                          </TransactionProvider>
                        </PurchaseProvider>

                      </PricesProvider>
              </ItemModalProvider>
                    </SKUProvider>
                  </ExcelProvider>
                </PrintProvider>
            </SalesmanModalProvider>
          </SalesmanProvider>
        </AuthProvider>
      </DepoProvider>

    </BrowserRouter>
  </React.StrictMode>
)
