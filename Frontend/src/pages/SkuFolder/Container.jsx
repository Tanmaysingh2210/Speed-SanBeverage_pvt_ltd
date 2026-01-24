import React, { useEffect, useState, useRef } from "react";
import './Container.css';
import { useSKU } from '../../context/SKUContext';
import {useAuth} from '../../context/AuthContext';



const Container = () => {
  const {user} =useAuth();
  const { containers, addContainer, getContaienerByID, deleteContainer, updateContainer, getAllContainers, loading } = useSKU();

  useEffect(() => {
    getAllContainers();
  }, []);


  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newContainer, setNewContainer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const addInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showForm && addInputRef.current) addInputRef.current.focus();
  }, [showForm]);

  const filteredContainers = containers.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContainer = async () => {
    if (newContainer.trim() === "") return;
    await addContainer({serial: containers.length + 1 , name: newContainer.toUpperCase(), depo: user.depo });
    setNewContainer("");
  };



  // async function handleSaveEdit(id) {
  //   // setContainers(containers.map((item) =>
  //   //   item.id === id ? { ...item, name: editValue.toUpperCase() } : item
  //   // )
  //   // );
  //   // setEditId(null);
  //   // setEditValue("");

  // }

  const handleSaveEdit = async (id) => {
    if (editValue.trim() === "") return;
    await updateContainer(id, { name: editValue.toUpperCase() });
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = async (id) => {
    await deleteContainer(id);
  };

  return (
    <div className="container-wrapper">
      {/* Header section */}
      <div className="top-bar">
        <input
          type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search Containers..."
          className="search-input"
        />
        <button className="add-btn-con" onClick={() => setShowForm(true)}>
          + New
        </button>
      </div>

      {/* Add New Container Form */}
      {showForm && (
        <div className="form-wrapper">
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
            className="name-input"
          />
          <button onClick={handleAddContainer}>Add</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {/* Table Header */}
      <div className="grid-layout header-section">
        <div>S NO.</div>
        <div>NAME</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Table Body */}
      {filteredContainers.map((item, index) => (
        <div key={item._id || index} className="grid-layout data-row">
          <div>{index + 1}</div>

          {/* If this item is being edited, show input instead of text */}
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
      {!loading && filteredContainers.length === 0 && (
        <div className="no-data">No containers found.</div>
      )}
    </div>
  );
};

export default Container;
