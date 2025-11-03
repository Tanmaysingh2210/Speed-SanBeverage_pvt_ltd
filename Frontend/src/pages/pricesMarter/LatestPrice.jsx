import React, { useState, useRef, useEffect } from "react";
import "./Prices.css";
import { usePrice } from "../../context/PricesContext";
import { useSKU } from "../../context/SKUContext";
import toast from "react-hot-toast"

const LatestPrice = () => {

    const { prices, getAllPrices, getPriceByID, updatePrice, deletePrice, addPrice, loading } = usePrice();
    const { items, getAllItems } = useSKU();

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [newPrice, setNewPrice] = useState({
        code: "",
        name: "",
        basePrice: "",
        perTax: "",
        date: "",
        status: "Active",
    });

    const codeRef = useRef(null);
    const baseRef = useRef(null);
    const taxRef = useRef(null);
    const dateRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);
    const modalRef = useRef(null);

    const calculateNetRate = (basePrice, perTax) => {
        if (!basePrice || !perTax) return '';
        return (parseFloat(basePrice) + (parseFloat(basePrice) * parseFloat(perTax) / 100)).toFixed(2)
    };

    useEffect(() => {
        getAllItems();
        getAllPrices();
    }, []);


    useEffect(() => {
        if (showModal) {
            setTimeout(() => codeRef.current?.focus(), 100);
        }
    }, [showModal]);

    // Auto update name when code changes
    useEffect(() => {
        const found = items.find(
            (item) => item.code.toUpperCase() === newPrice.code.toUpperCase()
        );
        if (found) {
            setNewPrice((prev) => ({
                ...prev,
                name: found.name,
            }));
        } else if (newPrice.code) {
            setNewPrice((prev) => ({
                ...prev,
                name: "",
            }));
        }
    }, [newPrice.code, items]);

    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "save") {
                saveRef.current?.click();
                return;
            }

            switch (currentField) {
                case "code":
                    baseRef.current?.focus();
                    break;
                case "basePrice":
                    taxRef.current?.focus();
                    break;
                case "perTax":
                    dateRef.current?.focus();
                    break;
                case "date":
                    statusRef.current?.focus();
                    break;
                case "status":
                    if (e.key === "Enter") {
                        saveRef.current?.click();
                    } else {
                        saveRef.current?.focus();
                    }
                    break;
                default:
                    break;
            }
        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "basePrice":
                    codeRef.current?.focus();
                    break;
                case "perTax":
                    baseRef.current?.focus();
                    break;
                case "date":
                    taxRef.current?.focus();
                    break;
                case "status":
                    dateRef.current?.focus();
                    break;
                case "save":
                    statusRef.current?.focus();
                    break;
                default:
                    break;
            }
        }
    };

    const formatDate = (isoDate) => { //yyyy-mm-dd
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; //dd-mm-yyyy
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };
        if (showModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);



    const handleSave = async (e) => {
        e.preventDefault();

        if (!newPrice.basePrice || !newPrice.perTax || !newPrice.date) {
            toast.error("⚠️ Please fill all fields!");
            return;
        }

        const payload = {
            code: newPrice.code,
            name: newPrice.name,
            basePrice: Number(newPrice.basePrice),
            perTax: Number(newPrice.perTax),
            date: newPrice.date, // backend expects `date` (lowercase)
            status: editId ? newPrice.status : "Active", //  Force Active for new prices
        };
        console.log('add/update price payload', payload);

        try {
            if (editId) {
                await updatePrice(editId, payload);
            } else {
                await addPrice(payload);
            };

            setShowModal(false);
            setEditId(null);
            setNewPrice({
                code: "",
                name: "",
                basePrice: "",
                perTax: "",
                date: "",
                netRate: "",
                status: "Active",
            });

        } catch (err) {
            console.error(err?.response?.data?.message || "Error adding or editing price");
        }
    };

    const handleDelete = async (id) => {
        await deletePrice(id);
    };

    const handleEdit = (price) => {
        setEditId(price._id);

        setNewPrice({
            code: price.itemCode || "",
            name: price.name || "",
            basePrice: price.basePrice || "",
            perTax: price.perTax || "",
            date: price.date ? price.date.split("T")[0] : "",
            status: price.status || "Active"
        });
        setShowModal(true);
    };

    // Filter prices by search term
    const safeString = v => (v === null || v === undefined) ? '' : String(v);

    // Safe filtered list
    const filtered = Array.isArray(prices)
  ? prices
      .filter(p => p?.status === "Active") //  Only show active prices
      .filter(p => safeString(p?.name).toLowerCase().includes(safeString(search).toLowerCase()))
  : [];

    return (
        <div className="price-container">
            {/* Header */}
            <div className="price-header">
                <input
                    type="text"
                    placeholder="🔍 Search Items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="price-search"
                />
                <button
                    className="price-add-btn"
                    disabled={loading}
                        onClick={() => {
                        setShowModal(true);
                        setEditId(null);
                        setNewPrice({
                            code: "",
                            name: "",
                            basePrice: "",
                            perTax: "",
                            date: "",
                            netRate: "",
                            status: "Active",
                        });
                    }}
                >
                    + New Price
                </button>
            </div>

            {loading && <div className="loading">Loading...</div>}

            {/* Table */}
            <div className="price-table">
                <div className="price-row header">
                    <div>SL.NO.</div>
                    <div>CODE</div>
                    <div>NAME</div>
                    <div>BASE PRICE</div>
                    <div>% TAX</div>
                    <div>NET RATE</div>
                    <div>DATE</div>
                    <div>STATUS</div>
                    <div>ACTIONS</div>
                </div>

                {filtered.length === 0 && !loading && (
                    <div className="no-data">No prices found</div>
                )}

                {filtered.map((p, i) => (
                    <div key={p?._id || i} className="price-row">
                        <div>{i + 1}</div>
                        <div>{p?.itemCode?.toUpperCase() || ''}</div>
                        <div>{p?.name?.toUpperCase() || ''}</div>
                        <div>{p?.basePrice || ''}</div>
                        <div>{p?.perTax || ''}%</div>
                        <div>{calculateNetRate(p?.basePrice, p?.perTax)}</div>
                        <div>{formatDate(p?.date) || ''}</div>

                        <div className="status">
                            <span
                                className={`status-badge ${p?.status === "Active" ? "active" : "inactive"
                                    }`}
                            >
                                {p?.status || ''}
                            </span>
                        </div>
                        <div className="actions">
                            <span className="edit" onClick={() => handleEdit(p)}>
                                Edit
                            </span>{" "}
                            |{" "}
                            <span
                                className="delete"
                                onClick={() => handleDelete(p._id)}
                            >
                                Delete
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" ref={modalRef}>
                        <h2>{editId ? "Edit Price" : "Add New Price"}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Item Code</label>
                                <input
                                    ref={codeRef}
                                    type="text"
                                    value={newPrice.code}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, code: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "code")}
                                    disabled={editId} // Disable code editing when updating
                                />
                            </div>

                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={newPrice.name}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Base Price</label>
                                <input
                                    ref={baseRef}
                                    type="number"
                                    value={newPrice.basePrice}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, basePrice: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "basePrice")}
                                />
                            </div>

                            <div className="form-group">
                                <label>% Tax</label>
                                <input
                                    ref={taxRef}
                                    type="number"
                                    value={newPrice.perTax}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, perTax: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "perTax")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    ref={dateRef}
                                    type="date"
                                    value={newPrice.date}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, date: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Net Rate</label>
                                <input
                                    type="text"
                                    value={calculateNetRate(newPrice.basePrice, newPrice.perTax)}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>

                                {editId && (
                                    
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    ref={statusRef}
                                    value={newPrice.status}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, status: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "status")}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                                )}

                            <div className="modal-buttons">
                                <button
                                    ref={saveRef}
                                    type="submit"
                                    className="submit-btn"
                                    onKeyDown={(e) => handleKeyNav(e, "save")}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LatestPrice;