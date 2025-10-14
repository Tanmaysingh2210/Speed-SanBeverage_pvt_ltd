import React from 'react'
import { useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Container from './Container';
import Flavour from './Flavour'
import Package from './Package'
import Item from './Item'



const Sku = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <>

            <div className='big-box'>
                <div className="box">
                    <h2>SKU MASTERS</h2>
                    <div className="options">
                        {/* <ul>
                            <li><Link to={`/sku/container`} className={location.pathname.includes('container') ? 'active' : ''}>Container</Link></li>
                            <li><Link to={`/sku/package`} className={location.pathname.includes('package') ? 'active' : ''}>Packaging</Link></li>
                            <li><Link to={`/sku/flavour`} className={location.pathname.includes('flavour') ? 'active' : ''}>Flavour</Link></li>
                            <li><Link to={`/sku/item`} className={location.pathname.includes('item') ? 'active' : ''}>Item Master</Link></li>
                        </ul> */}
                        <ul>
                            <li><NavLink to={`/sku/container`} className={({ isActive }) => (isActive ? 'active' : '')}>Container</NavLink></li>
                            <li><NavLink to={`/sku/package`} className={({ isActive }) => (isActive ? 'active' : '')}>Packaging</NavLink></li>
                            <li><NavLink to={`/sku/flavour`} className={({ isActive }) => (isActive ? 'active' : '')}>Flavour</NavLink></li>
                            <li><NavLink to={`/sku/item`} className={({ isActive }) => (isActive ? 'active' : '')}>Item Master</NavLink></li>
                        </ul>
                    </div>

                    {/* <div className="content">
                        <div className="add">
                            <div className="search"><input
                                type="text"
                                placeholder="Search Items..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            /></div>
                            <div className="button"><p>New Item</p></div>
                        </div>
                    </div> */}
                    <Routes>
                        <Route path="container" element={<Container />} />
                        <Route path="package" element={<Package />} />
                        <Route path="flavour" element={<Flavour />} />
                        <Route path="item" element={<Item />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default Sku
