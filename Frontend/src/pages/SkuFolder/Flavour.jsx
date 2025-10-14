import React, { useState } from 'react'

const Flavour = () => {
  const [flavours, setFlavours] = useState([
        { id: 1, name: "PEPSI" },
        { id: 2, name: "MIRINDA" },
        { id: 3, name: "MOUNTAIN DEW" },
      ]);
      return (
        <div className="table-container">
          {/* Header section */}
          <div className="header-row">
            <input type="text" placeholder="🔍 Search flavours..." className="search-box" />
            <button className="new-item-btn">+ New Container</button>
          </div>
    
          {/* Table Header */}
          <div className="table-grid table-header">
            <div>SL.NO.</div>
            <div>NAME</div>
            <div>ACTIONS</div>
          </div>
    
          {/* Table Body */}
          {flavours.map((item, index) => (
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

export default Flavour
