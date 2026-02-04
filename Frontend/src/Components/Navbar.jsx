import React from 'react'
import { Link } from 'react-router-dom';
import { FaWineBottle } from "react-icons/fa";


const Navbar = () => {
  return (
    <div className='nav'>
      <nav className="space-between">
        <div className="san-logo">
          <FaWineBottle className="text-blue-600 text-2xl" />

          SAN Beverages
        </div>
        <div>
          <ul className='elements'>
            <li><Link to={`/`}>Dashboard</Link></li>
            <li><Link to={`/statistics`}>Statistics</Link></li>
            <li><Link to={`/summary`}>Summary</Link></li>
            <li className="register-red"><Link to={`/register`}>Register</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
