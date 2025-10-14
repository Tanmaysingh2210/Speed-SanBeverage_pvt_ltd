import React, { useState } from 'react'

const Package = () => {
  const [packages, setPackages] = useState([
        { id: 1, name: "200ml" },
        { id: 2, name: "600ml" },
        { id: 3, name: "1000ml" },
      ]);
      return (
        <div className="table-container">
          {/* Header section */}
          <div className="header-row">
            <input type="text" placeholder="🔍 Search Packages..." className="search-box" />
            <button className="new-item-btn">+ New Package</button>
          </div>
    
          {/* Table Header */}
          <div className="table-grid table-header">
            <div>SL.NO.</div>
            <div>NAME</div>
            <div>ACTIONS</div>
          </div>
    
          {/* Table Body */}
          {packages.map((item, index) => (
            <div key={item.id} className="table-grid table-row">
              <div>{index + 1}</div>
              <div>{item.name}</div>
              <div className="actions">
                <span className="edit">Edit</span> |{" "}
                <span className="delete">Delete</span>
              </div>
            </div>
          ))}
        </div>
      )
}

export default Package
