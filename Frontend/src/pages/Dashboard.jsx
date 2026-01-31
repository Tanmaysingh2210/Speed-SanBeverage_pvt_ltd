import React from 'react'
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Burger from '../Components/Burger'
import Statistics from './Statistics'
import Sku from './SkuFolder/Sku'
import Salesman from './Salesman'
import PriceRoutes from './pricesMarter/PriceRoutes';
import Transaction from './transaction/TransactionRoutes';
import Purchase from './purchase/PurchaseRoutes';
import Depo from './Depo';
import StockDashboard from './stock/Stock';
import SummaryRoutes from './Summary/SummaryRoutes';
import RegisterPage from './RegisterPage';


const Dashboard = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Burger onMenuToggle={setMenuOpen} />
      <div className={`big-box ${!menuOpen ? 'centered' : ''}`}>

        <Routes>
          <Route index element={<Navigate to="stock" replace />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/summary/*" element={<SummaryRoutes />} />
          <Route path="/sku/*" element={<Sku />} />
          <Route path="/salesman" element={<Salesman />} />
          <Route path="/prices/*" element={<PriceRoutes />} />
          <Route path="/transaction/*" element={<Transaction />} />
          <Route path="/purchase/*" element={<Purchase />} />
          <Route path="/depo" element={<Depo />} />
          <Route path="/stock" index element={<StockDashboard />} />
        </Routes>
      </div>
    </>
  )
}

export default Dashboard
