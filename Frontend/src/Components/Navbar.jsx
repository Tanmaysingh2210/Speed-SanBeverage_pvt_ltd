import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav'>
      <nav>
        <ul className='elements'>
            <li><Link to={`/`}>Dashboard</Link></li>
            <li><Link to={`/statistics`}>Statistics</Link></li>
            <li><Link to={`/summary`}>Summary</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
