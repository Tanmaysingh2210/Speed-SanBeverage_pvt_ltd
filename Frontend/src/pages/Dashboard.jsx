import React from 'react'
import  { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Burger from '../Components/Burger'
import Statistics from './Statistics'
import Summary from './Summary'
import Sku from './SkuFolder/Sku'
import Salesman from './Salesman'
import PriceRoutes from './pricesMarter/PriceRoutes';
import Transaction from'./transaction/TransactionRoutes';
import Purchase from './purchase/PurchaseRoutes';

const Dashboard = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Burger onMenuToggle={setMenuOpen}/>
      <div className={`big-box ${!menuOpen ? 'centered' : ''}`}>

        <Routes>
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/sku/*" element={<Sku />} />
          <Route path="/salesman" element={<Salesman />} />
          <Route path="/prices/*" element={<PriceRoutes />} />
          <Route path="/transaction/*" element={<Transaction />} /> 
          <Route path="/purchase/*" element={<Purchase />} />
        </Routes>
      </div>
    </>
  )
}

export default Dashboard
