import React, { useState } from 'react'

const Item = () => {

  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [items, setItems] = useState([
    { id: 1, name: "PEPSI", rate: 1000, volume: "200ml", status: "Active" },
    { id: 2, name: "MIRINDA", rate: 1000, volume: "300ml", status: "Active" },
    { id: 3, name: "MAAZA", rate: 1000, volume: "300ml", status: "Inactive" },
  ]);
  return (
    <div className="table-container">
      {/* Header section */}
      <div className="header-row">
        <input type="text" placeholder="🔍 Search Items..." className="search-box" />
        <button className="new-item-btn" onClick={handleOpen}>+ New Item</button>
      </div>

      {/* Table Header */}
      <div className="table-grid table-header">
        <div>SL.NO.</div>
        <div>NAME</div>
        <div>NET RATE</div>
        <div>VOLUME</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      
      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Item</h2>
            <form className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Enter item name" />
              </div>

              <div className="form-group">
                <label>Net Rate</label>
                <input type="number" placeholder="Enter rate" />
              </div>

              <div className="form-group">
                <label>Volume</label>
                <input type="text" placeholder="e.g. 200ml" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Table Body */}
      {items.map((item, index) => (
        <div key={item.id} className="table-grid table-row">
          <div>{index + 1}</div>
          <div>{item.name}</div>
          <div>{item.rate.toFixed(2)}</div>
          <div>{item.volume}</div>
          <div>
            <span
              className={`status-badge ${item.status === "Active" ? "active" : "inactive"
                }`}
            >
              {item.status}
            </span>
          </div>
          <div className="actions">
            <span className="edit">Edit</span> |{" "}
            <span className="delete">Delete</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Item
