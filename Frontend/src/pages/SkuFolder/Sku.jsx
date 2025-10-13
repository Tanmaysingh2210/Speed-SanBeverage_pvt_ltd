import React from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Container from './Container';
import Flavour from './Flavour'
import Package from './Package'
import Item from './Item'



const Sku = () => {
    return (
        <>
            <Routes>
                <Route path="/container" element={<Container />} />
                <Route path="/package" element={<Package />} />
                <Route path="/flavour" element={<Flavour />} />
                <Route path="/item" element={<Item />} />
            </Routes>
            <div className='big-box'>
                <div className="box">
                    <h3>SKU MASTERS</h3>
                    <div className="options">
                        <ul>
                            <li><Link to={`/container`}>Container</Link></li>
                            <li><Link to={`/package`}>Packaging</Link></li>
                            <li><Link to={`/flavour`}>Flavour</Link></li>
                            <li><Link to={`/item`}>Item Master</Link></li>
                        </ul>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Sku
