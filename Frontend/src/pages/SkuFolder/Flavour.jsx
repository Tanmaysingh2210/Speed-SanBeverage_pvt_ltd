import React, { useState, useRef, useEffect } from 'react'

const Flavour = () => {
  const [flavours, setFlavours] = useState([
    { id: 1, name: "PEPSI" },
    { id: 2, name: "MIRINDA" },
    { id: 3, name: "MOUNTAIN DEW" },
  ]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newFlavour, setNewFlavour] = useState("");

  const addInputRef = useRef(null);
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (showForm && addInputRef.current) {
      addInputRef.current.focus(); // auto focus when form appears
    }
  }, [showForm]);


  const filteredFlavours = flavours.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFlavour = () => {
    if (newFlavour.trim() === "") return;

    const newItem = {
      id: flavours.length + 1,
      name: newFlavour.toUpperCase(),
    };

    setFlavours([...flavours, newItem]);
    setNewFlavour("");
    // setShowForm(false);

  };
  function handleEdit(id, name) {
    setEditId(id);
    setEditValue(name);
  }
  function handleSaveEdit(id) {
    setFlavours(flavours.map((item) =>
      item.id === id ? { ...item, name: editValue.toUpperCase() } : item
    )
    );
    setEditId(null);
    setEditValue("");
  }

  function handleDelete(id) {
    setFlavours(flavours.filter((item) => item.id !== id));
  };


  return (
    <div className="table-container">
      {/* Header section */}
      <div className="header-row">
        <input type="text"
          ref={searchRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search flavours..."
          className="search-box"
        />
        <button className="new-item-btn" onClick={() => setShowForm(true)}>+ New Flavour</button>
      </div>

      {/* Add New Container Form */}
      {showForm && (
        <div className="input-container">
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
            className="add-container"
          />
          <button onClick={handleAddFlavour}>Add</button>
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
      {filteredFlavours.map((item, index) => (
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
export default Flavour
