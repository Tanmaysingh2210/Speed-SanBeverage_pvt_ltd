import React, { useState, useEffect, useRef } from 'react';
import './Item.css';
import { useSKU } from '../../context/SKUContext';
import toast from 'react-hot-toast';

const Item = () => {
  const {
    items,
    getAllItems,
    getItemByID,
    updateItem,
    deleteItem,
    addItem,
    loading,
    containers,
    getAllContainers,
    packages,
    getAllPackages,
    flavours,
    getAllFlavours,
  } = useSKU();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [filteredContainers, setFilteredContainers] = useState([]);
  const [filteredFlavours, setFilteredFlavours] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);


  const [newItem, setNewItem] = useState({
    code: "",
    name: "",
    container: "",
    package: "",
    flavour: "",
    status: "Active",
  });

  const codeInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const containerInputRef = useRef(null);
  const packageInputRef = useRef(null);
  const flavourInputRef = useRef(null);
  const statusInputRef = useRef(null);
  const saveBtnRef = useRef(null);

  const modalRef = useRef(null);

  // Refs for modal inputs
  const modalCodeRef = useRef(null);
  const modalNameRef = useRef(null);
  const modalContainerRef = useRef(null);
  const modalPackageRef = useRef(null);
  const modalFlavourRef = useRef(null);
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
  const handleAddItem = async (e) => {
    e?.preventDefault();
    console.log('handleAddItem called');
    if (isSubmittingRef.current) return; // synchronous guard
    if (!newItem.code || !newItem.name || !newItem.container || !newItem.package || !newItem.flavour) {
      toast.error('Fill all fields');
      return;
    }

    try {
      // set synchronous guard first to avoid duplicate calls before state updates
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      await addItem({
        code: newItem.code.toUpperCase(),
        name: newItem.name.toUpperCase(),
        container: newItem.container.toUpperCase(),
        package: newItem.package.toUpperCase(),
        flavour: newItem.flavour.toUpperCase(),
        status: newItem.status
      });

      setNewItem({
        code: '',
        name: '',
        container: '',
        package: '',
        flavour: '',
        status: 'Active',
      });

      // close modal after successful add
      setShowModal(false);
    } catch (err) {
      console.error(err?.response?.data?.message || 'Failed to add item');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setEditId(item._id);
    // create a shallow copy to avoid mutating the original object
    setEditItem({ ...item });

    // wait until input renders
    setTimeout(() => {
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }, 50);
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateItem(id, editItem);
      setEditId(null);
    } catch (err) {
      console.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    await deleteItem(id);

  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContainerChange = (e) => {
    const value = e.target.value;
    setNewItem({ ...newItem, container: value });
    setFilteredContainers(
      containers.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleFlavourChange = (e) => {
    const value = e.target.value;
    setNewItem({ ...newItem, flavour: value });
    setFilteredFlavours(
      flavours.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handlePackageChange = (e) => {
    const value = e.target.value;
    setNewItem({ ...newItem, package: value });
    setFilteredPackages(
      packages.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };


  const handleKeyNavigation = (e, nextField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      switch (nextField) {
        case "name":
          nameInputRef.current?.focus();
          break;
        case "container":
          containerInputRef.current?.focus();
          break;
        case "package":
          packageInputRef.current?.focus();
          break;
        case "flavour":
          flavourInputRef.current?.focus();
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
    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();

      // if (e.key === "Enter" && currentField === "save") {
      //   e.preventDefault();
      //   modalSaveBtnRef.current?.click();
      // }

      if (currentField === "save" && e.key === "Enter") {
        modalSaveBtnRef.current?.click();
        return;
      }

      switch (currentField) {
        case "code":
          modalNameRef.current?.focus();
          break;
        case "name":
          modalContainerRef.current?.focus();
          break;
        case "container":
          modalPackageRef.current?.focus();
          break;
        case "package":
          modalFlavourRef.current?.focus();
          break;
        case "flavour":
          modalStatusRef.current?.focus();
          break;
        case "status":
          modalSaveBtnRef.current?.focus();
          break;
        default:
          break;
      }
    } else if (e.key === "Enter") {
      if (currentField === "save") {
        return;
      }
      e.preventDefault();
      switch (currentField) {
        case "code":
          modalNameRef.current?.focus();
          break;
        case "name":
          modalContainerRef.current?.focus();
          break;
        case "container":
          modalPackageRef.current?.focus();
          break;
        case "package":
          modalFlavourRef.current?.focus();
          break;
        case "flavour":
          modalStatusRef.current?.focus();
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
        case "container":
          modalNameRef.current?.focus();
          break;
        case "package":
          modalContainerRef.current?.focus();
          break;
        case "flavour":
          modalPackageRef.current?.focus();
          break;
        case "status":
          modalFlavourRef.current?.focus();
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
      setNewItem({
        code: "",
        name: "",
        container: "",
        package: "",
        flavour: "",
        status: "Active",
      });
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
        <div>CONTAINER</div>
        <div>PACKAGE</div>
        <div>FLAVOUR</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Table Body */}
      {filteredItems.map((item, index) => (
        <div key={item._id || index} className="table-grid table-row">
          <div>{index + 1}</div>
          {editId === item._id ? (
            <>
              <input type="text"
                ref={codeInputRef}
                value={editItem.code}
                className='edit-input'
                onChange={(e) =>
                  setEditItem({ ...editItem, code: e.target.value.trim().toUpperCase() })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "name")}
              />
              <input
                type="text"
                ref={nameInputRef}
                value={editItem.name}
                className='edit-input'
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value.toUpperCase()  })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "container")}
              />
              <input
                type="text"
                ref={containerInputRef}
                value={editItem.container}
                className='edit-input'
                onChange={(e) =>
                  setEditItem({ ...editItem, container: e.target.value.toUpperCase()})
                }
                onKeyDown={(e) => handleKeyNavigation(e, "package")}
              />
              <input
                type="text"
                ref={packageInputRef}
                value={editItem.package}
                className='edit-input'
                onChange={(e) =>
                  setEditItem({ ...editItem, package: e.target.value.toUpperCase()})
                }
                onKeyDown={(e) => handleKeyNavigation(e, "flavour")}
              />
              <input
                type="text"
                ref={flavourInputRef}
                value={editItem.flavour}
                className='edit-input'
                onChange={(e) =>
                  setEditItem({ ...editItem, flavour: e.target.value.toUpperCase()  })
                }
                onKeyDown={(e) => handleKeyNavigation(e, "status")}
              />
              <select
                ref={statusInputRef}
                value={editItem.status}
                className='edit-input'
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
                  disabled={loading}
                  onClick={() => handleSaveEdit(item._id)}
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
              <div>{item.container}</div>
              <div>{item.package}</div>
              <div>{item.flavour}</div>
              <div className='status'>
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
                <span className="delete" onClick={() => handleDelete(item._id)}>
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
                    setNewItem({ ...newItem, code: e.target.value.trim().toUpperCase()  })
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
                    setNewItem({ ...newItem, name: e.target.value.toUpperCase() })
                  }
                  onKeyDown={(e) => handleModalKeyNavigation(e, "name")}
                  placeholder="Enter item name"
                />
              </div>


              <div className="form-group">
                <label>Container</label>
                <select
                  ref={modalContainerRef}
                  value={newItem.container}
                  onChange={(e) => setNewItem({ ...newItem, container: e.target.value })}
                  onKeyDown={(e) => handleModalKeyNavigation(e, "container")}
                >
                  <option value="">Select container</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    containers.map((c) => (
                      <option key={c._id || c} value={c.name || c}>
                        {c.name.toUpperCase() || c.toUpperCase()}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Package</label>
                <select
                  ref={modalPackageRef}
                  value={newItem.package}
                  onChange={(e) => setNewItem({ ...newItem, package: e.target.value })}
                  onKeyDown={(e) => handleModalKeyNavigation(e, "package")}
                >
                  <option value="">Select package</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    packages.map((c) => (
                      <option key={c._id || c} value={c.name || c}>
                        {c.name.toUpperCase() || c.toUpperCase()}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Flavour</label>
                <select
                  ref={modalFlavourRef}
                  value={newItem.flavour}
                  onChange={(e) => setNewItem({ ...newItem, flavour: e.target.value })}
                  onKeyDown={(e) => handleModalKeyNavigation(e, "flavour")}
                >
                  <option value="">Select flavour</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    flavours.map((c) => (
                      <option key={c._id || c} value={c.name || c}>
                        {c.name.toUpperCase() || c.toUpperCase()}
                      </option>
                    ))
                  )}
                </select>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
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

