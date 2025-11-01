import React, { useState, useRef, useEffect } from "react";
import { useSalesman } from "../context/SalesmanContext";
import toast from 'react-hot-toast';
import './salesman.css'


const Salesman = () => {
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const { salesmans, loading, getAllSalesmen, updateSalesman, addSalesman, getSalesmanByID, deleteSalesman } = useSalesman();

  useEffect(() => {
    getAllSalesmen();
  }, []);


  const [editId, setEditId] = useState(null);
  const [editSalesman, setEditSalesman] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [newSalesman, setNewSalesman] = useState({
    codeNo: "",
    name: "",
    routeNo: 0,
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
  const modalrouteNoRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);


  const handleAddSalesman = async (e) => {
    e.preventDefault();
    if (!newSalesman.codeNo || !newSalesman.name || !newSalesman.routeNo) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const newData = {
        codeNo: newSalesman.codeNo.toUpperCase(),
        name: newSalesman.name.toUpperCase(),
        routeNo: newSalesman.routeNo,
        status: newSalesman.status,
      };
      await addSalesman(newData);
      setNewSalesman({ codeNo: "", name: "", routeNo: 0, status: "Active" });
      setShowModal(false);
    } catch (err) {
      console.error(err.response.data.message || 'Failed to add salesman');

    }
  };

  const handleEdit = (salesman) => {
    setEditId(salesman._id);
    setEditSalesman({ ...salesman });

    setTimeout(() => {
      codeInputRef.current?.focus();
    }, 50);

  };

  const handleSaveEdit = async (id) => {
    try {
      await updateSalesman(id, editSalesman);
      setEditId(null);
      // toast.success("Salesman updated successfully");
    } catch (err) {
      console.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    await deleteSalesman(id);
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
        case "routeNo":
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
          modalrouteNoRef.current?.focus();
          break;
        case "routeNo":
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
        case "routeNo":
          modalNameRef.current?.focus();
          break;
        case "status":
          modalrouteNoRef.current?.focus();
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
      setNewSalesman({ codeNo: "", name: "", routeNo: 0, status: "Active" });
    }
  }, [showModal]);

  return (
    <div className="box">
      <h2>SALESMAN MASTERS</h2>

      <div className="salesman-container">
        {/* Header section */}
        <div className="salesman-header-row">
          <input
            type="text"
            placeholder="🔍 Search Salesman..."
            className="salesman-search-box"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button className="salesman-new-item-btn" onClick={() => setShowModal(true)}>
            + New
          </button>
        </div>

        {/* Table Header */}
        <div className="salesman-table-grid salesman-table-header">
          <div>SL.NO.</div>
          <div>CODE</div>
          <div>NAME</div>
          <div>ROUTE NO</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>

        {loading && <div className="loading">Loading...</div>}

        {/* Table Body */}
        {filteredSalesmans.map((salesman, index) => (
          <div key={salesman._id || index} className="salesman-table-grid salesman-table-row">
            <div>{index + 1}</div>
            {editId === salesman._id ? (
              <>
                <input
                  type="text"
                  ref={codeInputRef}
                  value={editSalesman.codeNo}
                  onChange={(e) =>
                    setEditSalesman({ ...editSalesman, codeNo: e.target.value })
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
                  onKeyDown={(e) => handleKeyNavigation(e, "routeNo")}
                />
                <input
                  type="number"
                  ref={routeInputRef}
                  value={editSalesman.routeNo}
                  onChange={(e) =>
                    setEditSalesman({
                      ...editSalesman,
                      routeNo: e.target.value,
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
                    disabled={loading}
                    onClick={() => handleSaveEdit(salesman._id)}
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
                <div>{salesman.codeNo.toUpperCase()}</div>
                <div>{salesman.name.toUpperCase()}</div>
                <div>{salesman.routeNo}</div>
                <div className={`status-badge ${salesman.status === "Active" ? "active" : "inactive"
                  }`}>{salesman.status}</div>
                <div className="actions">
                  <span className="edit" onClick={() => handleEdit(salesman)}>
                    Edit
                  </span>{" "}
                  |{" "}
                  <span
                    className="delete"
                    onClick={() => handleDelete(salesman._id)}
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
                    value={newSalesman.codeNo}
                    onChange={(e) =>
                      setNewSalesman({ ...newSalesman, codeNo: e.target.value })
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
                    ref={modalrouteNoRef}
                    value={newSalesman.routeNo}
                    onChange={(e) =>
                      setNewSalesman({
                        ...newSalesman,
                        routeNo: e.target.value,
                      })
                    }
                    onKeyDown={(e) => handleModalKeyNavigation(e, "routeNo")}
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
                    disabled={loading}
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
        {!loading && filteredSalesmans.length === 0 && (
          <div className="no-data">No salesmans found.</div>
        )}
      </div>
    </div>
  );
};

export default Salesman;
