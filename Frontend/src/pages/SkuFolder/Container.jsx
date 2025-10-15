import React, { useEffect, useState, useRef } from "react";
import './Container.css';

const Container = () => {
  const [containers, setContainers] = useState([
    { id: 1, name: "CAN" },
    { id: 2, name: "BOTTLE" },
    { id: 3, name: "TETRA" },
  ]);

  
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newContainer, setNewContainer] = useState("");

  const addInputRef = useRef(null);
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (showForm && addInputRef.current) {
      addInputRef.current.focus(); // auto focus when form appears
    }
  }, [showForm]);

  const filteredContainers = containers.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAddContainer = () => {
    if (newContainer.trim() === "") return;

    const newItem = {
      id: containers.length + 1,
      name: newContainer.toUpperCase(),
    };

    setContainers([...containers, newItem]);
    setNewContainer("");
    // setShowForm(false);
   
  };

  function handleEdit(id, name) {
    setEditId(id);
    setEditValue(name);
  }
  function handleSaveEdit(id) {
    setContainers(containers.map((item) =>
      item.id === id ? { ...item, name: editValue.toUpperCase() } : item
    )
    );
    setEditId(null);
    setEditValue("");
  }

  function handleDelete(id) {
    setContainers(containers.filter((item) => item.id !== id));
  };

  return (
    <div className="table-container">
      {/* Header section */}
      <div className="header-row">
        <input
          type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Containers..."
          className="search-box"
        />
        <button className="new-item-btn" onClick={() => setShowForm(true)}>
          + New Container
        </button>
      </div>

      {/* Add New Container Form */}
      {showForm && (
        <div className="input-container">
          <input
            type="text"
            value={newContainer}
            ref={addInputRef}
            onChange={(e) => setNewContainer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddContainer();
              }
            }}
            placeholder="Enter container name"
            className="add-container"
          />
          <button onClick={handleAddContainer}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {/* Table Header */}
      <div className="table-grid table-header">
        <div>S NO.</div>
        <div>NAME</div>
        <div>ACTIONS</div>
      </div>

      {/* Table Body */}
      {filteredContainers.map((item, index) => (
        <div key={item.id} className="table-grid table-row">
          <div>{index + 1}</div>

          {/* If this item is being edited, show input instead of text */}
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

export default Container;
