import React, { useState } from 'react'

const Container = () => {
  const [containers, setContainers] = useState([
      { id: 1, name: "CAN" },
      { id: 2, name: "BOTTLE" },
      { id: 3, name: "TETRA" },
    ]);
    return (
      <div className="table-container">
        {/* Header section */}
        <div className="header-row">
          <input type="text" placeholder="🔍 Search Conatiners..." className="search-box" />
          <button className="new-item-btn">+ New Container</button>
        </div>
  
        {/* Table Header */}
        <div className="table-grid table-header">
          <div>SL.NO.</div>
          <div>NAME</div>
          <div>ACTIONS</div>
        </div>
  
        {/* Table Body */}
        {containers.map((item, index) => (
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

export default Container
