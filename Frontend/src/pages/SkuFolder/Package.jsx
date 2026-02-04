import React, { useEffect, useState, useRef } from 'react'
import './Container.css';
import { useSKU } from '../../context/SKUContext';

const Package = () => {
  const { packages, addPackage, deletePackage, updatePackage, loading } = useSKU();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newpackage, setNewPackage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showForm && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [showForm]);

  const filteredPackages = packages.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = async () => {
    if (newpackage.trim() === "") return;
    await addPackage({ serial: packages.length + 1, name: newpackage.toUpperCase() });
    setNewPackage("");
  };

  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updatePackage(id, { name: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = async (id) => {
    await deletePackage(id);
  };



  return (
    <div className="container-wrapper">
      <div className="top-bar">
        <input type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Packages..."
          className="search-input"
        />
        <button className="add-btn-con" onClick={() => setShowForm(true)}>+ New </button>
      </div>
      {showForm && (
        <div className="form-wrapper">
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
            className="name-input"
          />
          <button onClick={handleAddPackage}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="grid-layout header-section">
        <div>SL.NO.</div>
        <div>NAME</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {filteredPackages.map((item, index) => (
        <div key={item._id || index} className="grid-layout data-row">
          <div>{index + 1}</div>

          <div>
            {editId === item._id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(item._id);
                }}
                autoFocus
                className="inline-edit"
              />
            ) : (
              item.name
            )}
          </div>

          <div className="action-buttons">
            {editId === item._id ? (
              <>
                <span
                  className="btn-save"
                  onClick={() => handleSaveEdit(item._id)}
                >
                  Save
                </span>{" "}
                |{" "}
                <span
                  className="btn-cancel"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </span>
              </>
            ) : (
              <>
                <span
                  className="btn-edit"
                  onClick={() => {
                    setEditId(item._id);
                    setEditValue(item.name);
                  }}
                >
                  Edit
                </span>{" "}
                |{" "}
                <span
                  className="btn-delete"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </span>
              </>
            )}
          </div>
        </div>
      ))}
      {!loading && filteredPackages.length === 0 && (
        <div className="no-data">No packages found.</div>
      )}
    </div>
  );
};


export default Package
