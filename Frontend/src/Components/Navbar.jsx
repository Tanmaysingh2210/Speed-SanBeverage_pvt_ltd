import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav'>
      <nav className="space-between">
        <div className="san-logo">
          SAN Beverages
        </div>
        <div>
        <ul className='elements'>
            <li><Link to={`/`}>Dashboard</Link></li>
            <li><Link to={`/statistics`}>Statistics</Link></li>
            <li><Link to={`/summary`}>Summary</Link></li>
            
        </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
