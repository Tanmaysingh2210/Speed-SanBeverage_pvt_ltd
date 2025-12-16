import React, { useState, useRef, useEffect } from "react";
import { useDepo } from "../context/depoContext";
import toast from 'react-hot-toast';
import './salesman.css'


const Depo = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);



    const { depos, loading, getAllDepo, updateDepo, addDepo, deleteDepo } = useDepo();



    const [editId, setEditId] = useState(null);
    const [editDepo, setEditDepo] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [newDepo, setNewDepo] = useState({
        depoCode: "",
        depoName: "",
        depoAddress: ""
    });

    // Refs for editing
    const codeInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const addressRef = useRef(null);
    const saveBtnRef = useRef(null);

    // Refs for modal
    const modalRef = useRef(null);
    const modalCodeRef = useRef(null);
    const modalNameRef = useRef(null);
    const modalAddressRef = useRef(null);
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


    const handleAddDepo = async (e) => {
        e.preventDefault();
        if (!newDepo.depoCode || !newDepo.depoName) {
            toast.error("Please fill code and name");
            return;
        }
        try {
            const newData = {
                depoCode: newDepo.depoCode.toUpperCase(),
                depoName: newDepo.depoName.toUpperCase(),
                depoAddress: newDepo.depoAddress,
            };
            console.log("Sending depo:", newData);

            await addDepo(newData);
            setNewDepo({ depoCode: "", depoName: "", depoAddress: "" });
            setShowModal(false);
        } catch (err) {
            console.error(err.response.data.message || 'Failed to add depo');

        }
    };

    const handleEdit = (depo) => {
        setEditId(depo._id);
        setEditDepo({ ...depo });

        setTimeout(() => {
            codeInputRef.current?.focus();
        }, 50);

    };

    const handleSaveEdit = async (id) => {
        try {
            await updateDepo(id, editDepo);
            setEditId(null);
            // toast.success("Salesman updated successfully");
        } catch (err) {
            console.error(err?.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        await deleteDepo(id);
    };

    const filteredDepos = depos.filter(
        (i) =>
            i?.depoName &&
            i.depoName.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleKeyNavigation = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "code":
                    nameInputRef.current?.focus();
                    break;
                case "name":
                    addressRef.current?.focus();
                    break;
                case "address":
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
                    modalAddressRef.current?.focus();
                    break;
                case "address":
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
                case "address":
                    modalNameRef.current?.focus();
                    break;

                case "save":
                    modalAddressRef.current?.focus();
                    break;
                default:
                    break;
            }
        }
    };


    useEffect(() => {
        if (!showModal) {
            setNewDepo({ depoCode: "", depoName: "", depoAddress: "" });
        }
    }, [showModal]);

    return (
        <div className="box">
            <h2>DEPO MASTER</h2>

            <div className="salesman-container">
                {/* Header section */}
                <div className="salesman-header-row">
                    <input
                        type="text"
                        placeholder="🔍 Search Depo..."
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
                    <div>ADDRESS</div>
                    <div>ACTIONS</div>
                </div>

                {loading && <div className="loading">Loading...</div>}

                {/* Table Body */}
                {filteredDepos.map((depo, index) => (
                    <div key={depo._id || index} className="salesman-table-grid salesman-table-row">
                        <div>{index + 1}</div>
                        {editId === depo._id ? (
                            <>
                                <input
                                    type="text"
                                    ref={codeInputRef}
                                    value={editDepo.depoCode}
                                    onChange={(e) =>
                                        setEditDepo({ ...editDepo, depoCode: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "code")}
                                />
                                <input
                                    type="text"
                                    ref={nameInputRef}
                                    value={editDepo.depoName}
                                    onChange={(e) =>
                                        setEditDepo({ ...editDepo, depoName: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "name")}
                                />
                                <input
                                    type="text"
                                    ref={addressRef}
                                    value={editDepo.depoAddress}
                                    onChange={(e) =>
                                        setEditDepo({
                                            ...editDepo,
                                            depoAddress: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) => handleKeyNavigation(e, "address")}
                                />

                                <div className="actions">
                                    <button
                                        className="save"
                                        ref={saveBtnRef}
                                        disabled={loading}
                                        onClick={() => handleSaveEdit(depo._id)}
                                    >
                                        Save
                                    </button>{" "}
                                    |{" "}
                                    <span className="cancel" onClick={() => setEditId(null)}>
                                        Cancel
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>{depo.depoCode.toUpperCase()}</div>
                                <div>{depo.depoName.toUpperCase()}</div>
                                <div>{depo.depoAddress}</div>

                                <div className="actions">
                                    <span className="edit" onClick={() => handleEdit(depo)}>
                                        Edit
                                    </span>{" "}
                                    |{" "}
                                    <span
                                        className="delete"
                                        onClick={() => handleDelete(depo._id)}
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
                            <h2>Add New Depo</h2>
                            <form className="modal-form" onSubmit={handleAddDepo}>
                                <div className="form-group">
                                    <label>Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Depo code"
                                        ref={modalCodeRef}
                                        value={newDepo.depoCode}
                                        onChange={(e) =>
                                            setNewDepo({ ...newDepo, depoCode: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "code")}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name of Depo"
                                        ref={modalNameRef}
                                        value={newDepo.depoName}
                                        onChange={(e) =>
                                            setNewDepo({ ...newDepo, depoName: e.target.value })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "name")}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Address"
                                        ref={modalAddressRef}
                                        value={newDepo.depoAddress}
                                        onChange={(e) =>
                                            setNewDepo({
                                                ...newDepo,
                                                depoAddress: e.target.value,
                                            })
                                        }
                                        onKeyDown={(e) => handleModalKeyNavigation(e, "address")}
                                    />
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
                {!loading && filteredDepos.length === 0 && (
                    <div className="no-data">No depo found.</div>
                )}
            </div>
        </div>
    );
};

export default Depo;
