import React, { useState, useRef, useEffect } from 'react';
import { useSKU } from '../../context/SKUContext';
import './Container.css';
import {useAuth} from '../../context/AuthContext';

const Flavour = () => {
  const { flavours, addFlavour, getFlavourByID, deleteFlavour, updateFlavour, getAllFlavours, loading } = useSKU();
  const {user} =useAuth();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newFlavour, setNewFlavour] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);


  useEffect(() => {
    if (showForm && addInputRef.current) {
      addInputRef.current.focus(); // auto focus when form appears
    }
  }, [showForm]);


  const filteredFlavours = flavours.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFlavour = async () => {
    if (newFlavour.trim() === "") return;
    await addFlavour({ serial: flavours.length + 1, name: newFlavour.toUpperCase(),depo: user.depo });
    setNewFlavour("");
  };


  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updateFlavour(id, { name: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };


  const handleDelete = async (id) => {
    await deleteFlavour(id);
  };

  return (
    <div className="container-wrapper">
      {/* Header section */}
      <div className="top-bar">
        <input type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search flavours..."
          className="search-input"
        />
        <button className="add-btn-con" onClick={() => setShowForm(true)}>+ New</button>
      </div>

      {/* Add New Container Form */}
      {showForm && (
        <div className="form-wrapper">
          <input
            type="text"
            value={newFlavour}
            ref={addInputRef}
            onChange={(e) => setNewFlavour(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddFlavour();
              }
            }}
            placeholder="Enter Flavour name"
            className="name-input"
          />
          <button onClick={handleAddFlavour} disabled={loading}>{loading? "Loading.":"Add"}</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}



      {/* Table Header */}
      <div className="grid-layout header-section">
        <div>SL.NO.</div>
        <div>NAME</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Table Body */}
      {filteredFlavours.map((item, index) => (
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

          {/* Actions */}
          <div className="action-buttons">
            {editId === item._id ? (
              <>
                <span
                  className="btn-save"
                  disabled = {loading}
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
      {!loading && filteredFlavours.length === 0 && (
        <div className="no-data">No flavours found.</div>
      )}
    </div>
  );
};
export default Flavour
