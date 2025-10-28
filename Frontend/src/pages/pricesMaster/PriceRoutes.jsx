import React from 'react';

import { Routes, Route, Link, NavLink , Navigate} from 'react-router-dom';
import LatestPrice from './LatestPrice';
import BrowsePrice from './BrowsePrice';

const PriceRoutes = () => {
    return (
        <>
            <div className="box">
                <h2>PRICE MASTERS</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/prices/latest`} className={({ isActive }) => (isActive ? 'active' : '')}>Latest Price</NavLink></li>
                        <li><NavLink to={`/prices/browse`} className={({ isActive }) => (isActive ? 'active' : '')}>Browse</NavLink></li>
                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="latest" replace />} />

                    <Route path="latest" element={<LatestPrice />} />
                    <Route path="browse" element={<BrowsePrice />} />
                </Routes>
            </div>
        </>
    )
}

export default PriceRoutes
