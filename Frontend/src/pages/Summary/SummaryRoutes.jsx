import React from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import ItemWiseSummary from './Item-wise';
import SalesmanWiseItemWise from './SalesmanWiseItemWise';
import CashChequeSummary from './cashCheque';
import EmtAndMtSummary from './EmtAndMt';

const SummaryRoutes = () => {
    return (
        <>
            <div className="box">
                <h2>Summary Report</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/summary/item-wise`} className={({ isActive }) => (isActive ? 'active' : '')}>Itemwise</NavLink></li>
                        <li><NavLink to={`/summary/salesman-wise-item-wise`} className={({ isActive }) => (isActive ? 'active' : '')}>Salesmanwise Itemwise</NavLink></li>
                        <li><NavLink to={`/summary/cash-cheque`} className={({ isActive }) => (isActive ? 'active' : '')}>Cash-Cheque Summary</NavLink></li>
                        <li><NavLink to={`/summary/emt-mt`} className={({ isActive }) => (isActive ? 'active' : '')}>Emt And Mt Summary</NavLink></li>


                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="item-wise" replace />} />

                    <Route path="item-wise" element={<ItemWiseSummary />} />
                    <Route path="salesman-wise-item-wise" element={<SalesmanWiseItemWise />} />
                    <Route path="cash-cheque" element={<CashChequeSummary />} />
                    <Route path="emt-mt" element={<EmtAndMtSummary />} />


                </Routes>
            </div>
        </>
    )
}

export default SummaryRoutes