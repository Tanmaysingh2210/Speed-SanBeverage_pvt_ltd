import React from 'react';

import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import PurchaseEntry from "./PurchaseEntry";
import PurchaseItemwise from "./PurchaseItemwise";
import './purchase.css'

const Purchase = () =>{
    return(
        <>
            <div className="box">
                            <h2>Purchase</h2>
                            <div className="options">
                                <ul >
                                    <li><NavLink to={`/purchase/purchaseEntry`} className={({ isActive }) => (isActive ? 'active' : '')}> Purchase-Entry</NavLink></li>
                                    
                                </ul>
                                <ul>
                                    <li><NavLink to={`/purchase/purchaseItemwise`} className={({ isActive }) => (isActive ? 'active' : '')}> Purchase-Itemwise</NavLink></li>
                                    
                                </ul>
                            </div>

                <Routes>
                    <Route index element={<Navigate to="purchaseEntry" replace />} />
                    
                    <Route path="purchaseEntry" element={<PurchaseEntry />} />
                    <Route path="purchaseItemwise" element={<PurchaseItemwise />} />

                    
                </Routes>
            </div>
        </>
    )
}

export default Purchase;
