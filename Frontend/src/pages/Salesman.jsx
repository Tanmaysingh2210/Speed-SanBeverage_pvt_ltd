import React, { useState, useRef, useEffect } from "react";
import "./SkuFolder/Item.css";

const Salesman = () => {
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [salesmans, setSalesmans] = useState([
    { id: 1, code: "B001", name: "AYUSH", route_no: 1, status: "Active" },
    { id: 2, code: "A001", name: "TANMAY", route_no: 2, status: "Active" },
    { id: 3, code: "C001", name: "SHLOK", route_no: 3, status: "Inactive" },
  ]);

  const [editId, setEditId] = useState(null);
  const [editSalesman, setEditSalesman] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [newSalesman, setNewSalesman] = useState({
    code: "",
    name: "",
    route_no: "",
    status: "Active",
  });

  // Refs for editing
  const codeInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const routeInputRef = useRef(null);
  const statusInputRef = useRef(null);
  const saveBtnRef = useRef(null);

  // Refs for modal
  const modalRef = useRef(null);
  const modalCodeRef = useRef(null);
  const modalNameRef = useRef(null);
  const modalRoute_NoRef = useRef(null);
  const modalStatusRef = useRef(null);
  const modalSaveBtnRef = useRef(null);

  // Focus code input when modal opens
  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        modalCodeRef.current?.focus();
      }, 100);
    }
  }, [showModal]);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const handleAddSalesman = (e) => {
    e.preventDefault();
    if (!newSalesman.code || !newSalesman.name || !newSalesman.route_no) {
      return alert("Please fill all fields");
    }

    const newData = {
      id: salesmans.length + 1,
      code: newSalesman.code.toUpperCase(),
      name: newSalesman.name.toUpperCase(),
      route_no: newSalesman.route_no,
      status: newSalesman.status,
    };

    setSalesmans([...salesmans, newData]);
    setNewSalesman({ code: "", name: "", route_no: "", status: "Active" });
    setShowModal(false);
  };

  const handleEdit = (salesman) => {
    setEditId(salesman.id);
    setEditSalesman(salesman);

    setTimeout(() => {
      codeInputRef.current?.focus();
    }, 50);
  };

  const handleSaveEdit = (id) => {
    setSalesmans(
      salesmans.map((i) => (i.id === id ? editSalesman : i))
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    setSalesmans(salesmans.filter((i) => i.id !== id));
  };

  const filteredSalesmans = salesmans.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyNavigation = (e, nextField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      switch (nextField) {
        case "name":
          nameInputRef.current?.focus();
          break;
        case "route_no":
          routeInputRef.current?.focus();
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
        modalSaveBtnRef.current?.click();
        return;
      }

      switch (currentField) {
        case "code":
          modalNameRef.current?.focus();
          break;
        case "name":
          modalRoute_NoRef.current?.focus();
          break;
        case "route_no":
          modalStatusRef.current?.focus();
          break;
        case "status":
          modalSaveBtnRef.current?.focus();
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
        case "route_no":
          modalNameRef.current?.focus();
          break;
        case "status":
          modalRoute_NoRef.current?.focus();
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
      setNewSalesman({ code: "", name: "", route_no: "", status: "Active" });
    }
  }, [showModal]);

  return (
    <div className="box">
      <h2>SALESMAN MASTERS</h2>

      <div className="table-container">
        {/* Header section */}
        <div className="header-row">
          <input
            type="text"
            placeholder="🔍 Search Salesman..."
            className="search-box"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button className="new-item-btn" onClick={handleOpen}>
            + New
          </button>
        </div>

        {/* Table Header */}
        <div className="table-grid table-header">
          <div>SL.NO.</div>
          <div>CODE</div>
          <div>NAME</div>
          <div>ROUTE NO</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>

        {/* Table Body */}
        {filteredSalesmans.map((salesman, index) => (
          <div key={salesman.id} className="table-grid table-row">
            <div>{index + 1}</div>
            {editId === salesman.id ? (
              <>
                <input
                  type="text"
                  ref={codeInputRef}
                  value={editSalesman.code}
                  onChange={(e) =>
                    setEditSalesman({ ...editSalesman, code: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyNavigation(e, "name")}
                />
                <input
                  type="text"
                  ref={nameInputRef}
                  value={editSalesman.name}
                  onChange={(e) =>
                    setEditSalesman({ ...editSalesman, name: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyNavigation(e, "route_no")}
                />
                <input
                  type="number"
                  ref={routeInputRef}
                  value={editSalesman.route_no}
                  onChange={(e) =>
                    setEditSalesman({
                      ...editSalesman,
                      route_no: e.target.value,
                    })
                  }
                  onKeyDown={(e) => handleKeyNavigation(e, "status")}
                />
                <select
                  ref={statusInputRef}
                  value={editSalesman.status}
                  onChange={(e) =>
                    setEditSalesman({
                      ...editSalesman,
                      status: e.target.value,
                    })
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
                    onClick={() => handleSaveEdit(salesman.id)}
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
                <div>{salesman.code}</div>
                <div>{salesman.name}</div>
                <div>{salesman.route_no}</div>
                <div>{salesman.status}</div>
                <div className="actions">
                  <span className="edit" onClick={() => handleEdit(salesman)}>
                    Edit
                  </span>{" "}
                  |{" "}
                  <span
                    className="delete"
                    onClick={() => handleDelete(salesman.id)}
                  >
                    Delete
                  </span>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
              <h2>Add New Salesman</h2>
              <form className="modal-form" onSubmit={handleAddSalesman}>
                <div className="form-group">
                  <label>Code</label>
                  <input
                    type="text"
                    placeholder="Enter Salesman code"
                    ref={modalCodeRef}
                    value={newSalesman.code}
                    onChange={(e) =>
                      setNewSalesman({ ...newSalesman, code: e.target.value })
                    }
                    onKeyDown={(e) => handleModalKeyNavigation(e, "code")}
                  />
                </div>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter name of salesman"
                    ref={modalNameRef}
                    value={newSalesman.name}
                    onChange={(e) =>
                      setNewSalesman({ ...newSalesman, name: e.target.value })
                    }
                    onKeyDown={(e) => handleModalKeyNavigation(e, "name")}
                  />
                </div>

                <div className="form-group">
                  <label>Route No.</label>
                  <input
                    type="text"
                    placeholder="e.g 001"
                    ref={modalRoute_NoRef}
                    value={newSalesman.route_no}
                    onChange={(e) =>
                      setNewSalesman({
                        ...newSalesman,
                        route_no: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleModalKeyNavigation(e, "route_no")}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    ref={modalStatusRef}
                    value={newSalesman.status}
                    onChange={(e) =>
                      setNewSalesman({
                        ...newSalesman,
                        status: e.target.value,
                      })
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
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salesman;
