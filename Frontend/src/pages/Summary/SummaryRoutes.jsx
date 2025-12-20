import React from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import ItemWiseSummary from './Item-wise';
import SalesmanWiseItemWise from './SalesmanWiseItemWise';

const SummaryRoutes = () => {
    return (
        <>
            <div className="box">
                <h2>Summary Report</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/summary/item-wise`} className={({ isActive }) => (isActive ? 'active' : '')}>Item-wise</NavLink></li>
                        <li><NavLink to={`/summary/salesman-wise-item-wise`} className={({ isActive }) => (isActive ? 'active' : '')}>SalesmanWise-ItemWise</NavLink></li>

                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="item-wise" replace />} />

                    <Route path="item-wise" element={<ItemWiseSummary />} />
                    <Route path="salesman-wise-item-wise" element={<SalesmanWiseItemWise />} />

                </Routes>
            </div>
        </>
    )
}

export default SummaryRoutes