import React, { useState, useEffect, useRef } from 'react';
import './Item.css';

const Item = () => {

  const [showModal, setShowModal] = useState(false);

  // const handleOpen = () => setShowModal(true);
  // const handleClose = () => setShowModal(false);

  const [items, setItems] = useState([
    { id: 1, code: "P200", name: "PEPSI 200ML BOTTLE", rate: 600, volume: "200ml", status: "Active" },
    { id: 2, code: "M300", name: "MIRINDA 300ML CAN", rate: 500, volume: "300ml", status: "Active" },
    { id: 3, code: "S100", name: "Slice 100ML TETRA", rate: 300, volume: "100ml", status: "Inactive" },
  ]);

  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [newItem, setNewItem] = useState({
    code: "",
    name: "",
    rate: "",
    volume: "",
    status: "Active",
  });
  const codeInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const rateInputRef = useRef(null);
  const volumeInputRef = useRef(null);
  const statusInputRef = useRef(null);
  const saveBtnRef = useRef(null);

  const modalRef = useRef(null);

  // Refs for modal inputs
  const modalCodeRef = useRef(null);
  const modalNameRef = useRef(null);
  const modalRateRef = useRef(null);
  const modalVolumeRef = useRef(null);
  const modalStatusRef = useRef(null);
  const modalSaveBtnRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        modalCodeRef.current?.focus();
      }, 100);
    }
  }, [showModal]);


  // Close modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);


  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.code || !newItem.name || !newItem.rate || !newItem.volume) return alert("Fill all fields");

    const newData = {
      id: items.length + 1,
      code: newItem.code.toUpperCase(),
      name: newItem.name.toUpperCase(),
      rate: parseFloat(newItem.rate),
      volume: newItem.volume,
      status: newItem.status,
    };

    setItems([...items, newData]);
    setNewItem({ code: "", name: "", rate: "", volume: "", status: "Active" });
    setShowModal(false);
  };

  // Edit item
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditItem(item);

    // wait until input renders
    setTimeout(() => {
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }, 50);
  };

  const handleSaveEdit = (id) => {
    setItems(
      items.map((i) => (i.id === id ? editItem : i))
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleKeyNavigation = (e, nextField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      switch (nextField) {
        case "name":
          nameInputRef.current?.focus();
          break;
        case "rate":
          rateInputRef.current?.focus();
          break;
        case "volume":
          volumeInputRef.current?.focus();
          break;
        case "status":
          statusInputRef.current?.focus();
          break;
        case "save":
          saveBtnRef.current?.click();
          break;
        default:
          break;
      }
    }
  };


  const handleModalKeyNavigation = (e, currentField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();

      if (e.key === "Enter" && currentField === "save") {
        e.preventDefault();
        modalSaveBtnRef.current?.click();
      }

      // If Enter is pressed on the Save button, click it
      if (currentField === "save" && e.key === "Enter") {
        modalSaveBtnRef.current?.click();
        return;
      }

      switch (currentField) {
        case "code":
          modalNameRef.current?.focus();
          break;
        case "name":
          modalRateRef.current?.focus();
          break;
        case "rate":
          modalVolumeRef.current?.focus();
          break;
        case "volume":
          modalStatusRef.current?.focus();
          break;
        case "status":
          // if Enter pressed on last input (status)
          if (e.key === "Enter") {
            modalSaveBtnRef.current?.click(); // trigger save
          } else {
            modalSaveBtnRef.current?.focus(); // for arrow keys
          }
          break;
        default:
          break;
      }
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      switch (currentField) {
        case "name":
          modalCodeRef.current?.focus();
          break;
        case "rate":
          modalNameRef.current?.focus();
          break;
        case "volume":
          modalRateRef.current?.focus();
          break;
        case "status":
          modalVolumeRef.current?.focus();
          break;
        case "save":
          modalStatusRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (!showModal) {
      setNewItem({ code: "", name: "", rate: "", volume: "", status: "Active" });
    }
  }, [showModal]);


  return (
    <div className="table-container">
      {/* Header section */}
      <div className="header-row">
        <input type="text"
          placeholder="🔍 Search Items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <button className="new-item-btn" onClick={() => setShowModal(true)}>+ New Item</button>
      </div>

      {/* Table Header */}
      <div className="table-grid table-header">
        <div>SL.NO.</div>
        <div>Code</div>
        <div>NAME</div>
        <div>NET RATE</div>
        <div>VOLUME</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      {/* Table Body */}
      {filteredItems.map((item, index) => (
        <div key={item.id} className="table-grid table-row">
          <div>{index + 1}</div>
          {editId === item.id ? (
            <>
              <input type="text"
                ref={codeInputRef}
                value={editItem.code}
                onChange={(e) =>
                  setEditItem({ ...editItem, code: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "name")}
              />
              <input
                type="text"
                ref={nameInputRef}
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "rate")}
              />
              <input
                type="number"
                ref={rateInputRef}
                value={editItem.rate}
                onChange={(e) =>
                  setEditItem({ ...editItem, rate: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "volume")}
              />
              <input
                type="text"
                ref={volumeInputRef}
                value={editItem.volume}
                onChange={(e) =>
                  setEditItem({ ...editItem, volume: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "status")}
              />
              <select
                ref={statusInputRef}
                value={editItem.status}
                onChange={(e) =>
                  setEditItem({ ...editItem, status: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "save")}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="actions">
                <span
                  className="save"
                  ref={saveBtnRef}
                  onClick={() => handleSaveEdit(item.id)}
                >
                  Save
                </span>{" "}
                |{" "}
                <span className="cancel" onClick={() => setEditId(null)}>
                  Cancel
                </span>
              </div>
            </>
          ) : (
            <>
              <div>{item.code}</div>
              <div>{item.name}</div>
              <div>{item.rate}</div>
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
                <span className="edit" onClick={() => handleEdit(item)}>
                  Edit
                </span>{" "}
                |{" "}
                <span className="delete" onClick={() => handleDelete(item.id)}>
                  Delete
                </span>
              </div>
            </>
          )}
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <h2>Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Code</label>
                <input
                  ref={modalCodeRef}
                  type="text"
                  value={newItem.code}
                  onChange={(e) =>
                    setNewItem({ ...newItem, code: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "code")}
                  placeholder="Enter item code"
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  ref={modalNameRef}
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "name")}
                  placeholder="Enter item name"
                />
              </div>

              <div className="form-group">
                <label>Net Rate</label>
                <input
                  ref={modalRateRef}
                  type="number"
                  value={newItem.rate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, rate: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "rate")}
                  placeholder="Enter rate"
                />
              </div>

              <div className="form-group">
                <label>Volume</label>
                <input
                  ref={modalVolumeRef}
                  type="text"
                  value={newItem.volume}
                  onChange={(e) =>
                    setNewItem({ ...newItem, volume: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "volume")}
                  placeholder="e.g. 200ml"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  ref={modalStatusRef}
                  value={newItem.status}
                  onChange={(e) =>
                    setNewItem({ ...newItem, status: e.target.value })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "status")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="submit-btn"
                  ref={modalSaveBtnRef}
                  onKeyDown={(e) => handleModalKeyNavigation(e, "save")}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Item
