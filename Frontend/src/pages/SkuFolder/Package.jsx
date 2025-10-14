import React, { useEffect, useState, useRef } from 'react'

const Package = () => {
  const [packages, setPackages] = useState([
    { id: 1, name: "200ml" },
    { id: 2, name: "600ml" },
    { id: 3, name: "1000ml" },
  ]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newpackage, setNewPackage] = useState("");

  const addInputRef = useRef(null);
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showForm && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [showForm]);

  const filteredPackages = packages.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = () => {
    if (newpackage.trim() === "") return;

    const newItem = {
      id: packages.length + 1,
      name: newpackage.toLowerCase(),
    };
    setPackages([...packages, newItem]);
    setNewPackage("");
  }
  function handleEdit(id, name) {
    setEditId(id);
    setEditValue(name);
  }

  function handleSaveEdit(id) {
    setPackages(packages.map((item) =>
      item.id === id ? { ...item, name: editValue.toUpperCase() } : item
    )
    );
    setEditId(null);
    setEditValue("");
  }

  function handleDelete(id) {
    setPackages(packages.filter((item) => item.id !== id));
  };




  return (
    <div className="table-container">
      {/* Header section */}
      <div className="header-row">
        <input type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

          placeholder="🔍 Search Packages..."
          className="search-box"
        />
        <button className="new-item-btn" onClick={() => setShowForm(true)}>+ New Package</button>
      </div>
      {/* Add New Container Form */}
      {showForm && (
        <div className="input-container">
          <input
            type="text"
            value={newpackage}
            ref={addInputRef}
            onChange={(e) => setNewPackage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddPackage();
              }
            }}
            placeholder="Enter package name"
            className="add-container"
          />
          <button onClick={handleAddPackage}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {/* Table Header */}
      <div className="table-grid table-header">
        <div>SL.NO.</div>
        <div>NAME</div>
        <div>ACTIONS</div>
      </div>

      {/* Table Body */}
      {filteredPackages.map((item, index) => (
        <div key={item.id} className="table-grid table-row">
          <div>{index + 1}</div>

          <div>
            {editId === item.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(item.id);
                }}
                autoFocus
                className="edit-input"
              />
            ) : (
              item.name
            )}
          </div>

          {/* Actions */}
          <div className="actions">
            {editId === item.id ? (
              <>
                <span
                  className="save"
                  onClick={() => handleSaveEdit(item.id)}
                >
                  Save
                </span>{" "}
                |{" "}
                <span
                  className="cancel"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </span>
              </>
            ) : (
              <>
                <span
                  className="edit"
                  onClick={() => handleEdit(item.id, item.name)}
                >
                  Edit
                </span>{" "}
                |{" "}
                <span
                  className="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


export default Package
