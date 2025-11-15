import React from 'react';

import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import PurchaseEntry from "./PurchaseEntry";

const Purchase = () =>{
    return(
        <>
            <div className="box">
                            <h2>Purchase</h2>
                            <div className="options">
                                <ul>
                                    <li><NavLink to={`/purchase/purchaseEntry`} className={({ isActive }) => (isActive ? 'active' : '')}> Purcahse-Entry</NavLink></li>
                                    
                                </ul>
                            </div>

                <Routes>
                    <Route index element={<Navigate to="purchaseEntry" replace />} />
                    <Route path="purchaseEntry" element={<PurchaseEntry />} />

                    
                </Routes>
            </div>
        </>
    )
}

export default Purchase;
