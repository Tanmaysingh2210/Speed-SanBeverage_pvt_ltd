import React from 'react'
import { useState } from 'react';
import { Routes, Route, Link, NavLink , Navigate} from 'react-router-dom';
import Container from './Container';
import Flavour from './Flavour'
import Package from './Package'
import Item from './Item'



const Sku = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <>
                <div className="box">
                    <h2>SKU MASTERS</h2>
                    <div className="options">
                       
                        <ul>
                            <li><NavLink to={`/sku/container`} className={({ isActive }) => (isActive ? 'active' : '')}>Container</NavLink></li>
                            <li><NavLink to={`/sku/package`} className={({ isActive }) => (isActive ? 'active' : '')}>Packaging</NavLink></li>
                            <li><NavLink to={`/sku/flavour`} className={({ isActive }) => (isActive ? 'active' : '')}>Flavour</NavLink></li>
                            <li><NavLink to={`/sku/item`} className={({ isActive }) => (isActive ? 'active' : '')}>Item Master</NavLink></li>
                        </ul>
                    </div>
                   
                    <Routes>
                        <Route index element={<Navigate to="item" replace />} />

                        <Route path="container" element={<Container />} />
                        <Route path="package" element={<Package />} />
                        <Route path="flavour" element={<Flavour />} />
                        <Route path="item" element={<Item />} />
                    </Routes>
                </div>
        </>
    )
}

export default Sku
