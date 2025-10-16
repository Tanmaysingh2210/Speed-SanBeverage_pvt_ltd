import React from 'react'
import { Link } from 'react-router-dom'

const Burger = () => {
    return (
        <div className="burger-box">
            <div className="heading">
                <i className="fas fa-wine-bottle text-blue-600 text-2xl"></i>
                <h3 >SAN Beverages</h3>
            </div>
            <div className="line"></div>

            <ul className="burger-ul">
                <li>Transaction</li>
                <li><Link to={`/prices`}>Prices</Link> </li>
                <li><Link to={`/salesman`}>Salesman</Link></li>
                <li><Link to={`/sku`}>SKQ</Link></li>

            </ul>

        </div>
    )
}

export default Burger
