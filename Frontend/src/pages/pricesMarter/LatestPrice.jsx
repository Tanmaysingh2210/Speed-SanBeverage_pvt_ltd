import React, { useState, useRef, useEffect } from "react";
import "./Prices.css";

const LatestPrice = () => {
    const [items, setItems] = useState([]); // Dynamic items from backend
    const [prices, setPrices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
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

    const calculateNetRate= (basePrice , perTax)=>{
        if(!basePrice || !perTax) return '';
        return (parseFloat(basePrice) + (parseFloat(basePrice)*parseFloat(perTax)/100)).toFixed(2)
    };
    // Fetch all items (SKU) on component mount
    useEffect(() => {
        fetchItems();
        fetchPrices();
    }, []);

    // Fetch items from backend (all SKUs)
    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:3000/item"); // Adjust your endpoint
            const data = await response.json();
            setItems(data); // Expecting array like [{code: "P200", name: "PEPSI 200ML BOTTLE"}, ...]
        } catch (error) {
            console.error("Error fetching items:", error);
            alert("Failed to fetch items from server");
        }
    };

    // Fetch all prices from backend
    const fetchPrices = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/rates"); // Adjust your endpoint
            const data = await response.json();
             console.log('Fetched prices:', data);
            setPrices(data);
        } catch (error) {
            console.error("Error fetching prices:", error);
            alert("Failed to fetch prices from server");
        } finally {
            setLoading(false);
        }
    };
  

    // Autofocus when modal opens
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

    // Handle navigation keys
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

    // Handle Save (Create or Update)
    const handleSave = async (e) => {
        e.preventDefault();

        const found = items.find(
            (item) => item.code.toUpperCase() === newPrice.code.toUpperCase()
        );

        if (!found) {
            alert("❌ Invalid item code — item not found in database!");
            return;
        }

        if (!newPrice.basePrice || !newPrice.perTax || !newPrice.date) {
            alert("⚠️ Please fill all fields!");
            return;
        }

        try {
            setLoading(true);

            if (editId) {
                // UPDATE existing price
                const response = await fetch(`http://localhost:3000/rates/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    itemCode: newPrice.code,
                    name: newPrice.name,
                    basePrice: newPrice.basePrice,
                    perTax: newPrice.perTax,
                    Date: newPrice.date,
                    status: newPrice.status,
                })
                });

                if (!response.ok) throw new Error("Failed to update price");

                alert("✅ Price updated successfully!");
            } else {
                // CREATE new price
                const response = await fetch("http://localhost:3000/rates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    itemCode: newPrice.code,
                    name: newPrice.name,
                    basePrice: newPrice.basePrice,
                    perTax: newPrice.perTax,
                    Date: newPrice.date,
                    status: newPrice.status,
                })
                });

                if (!response.ok) throw new Error("Failed to create price");

                alert("✅ Price created successfully!");
            }

            // Refresh the prices list
            await fetchPrices();

            // Close modal and reset form
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
        } catch (error) {
            console.error("Error saving price:", error);
            alert("❌ Error saving price. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this price?")) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/rates/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete price");

            alert("✅ Price deleted successfully!");
            await fetchPrices(); // Refresh the list
        } catch (error) {
            console.error("Error deleting price:", error);
            alert("❌ Error deleting price. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (price) => {
    setEditId(price._id || price.id);

    setNewPrice({
        code: price.itemCode || "",
        name: price.name || "",
        basePrice: price.basePrice || "",
        perTax: price.perTax || "",
        date: price.Date ? price.Date.split("T")[0] : "",
        status: price.status || "Active"
    });

    setShowModal(true);
};
    // Filter prices by search term
    const safeString = v => (v === null || v === undefined) ? '' : String(v);

// Safe filtered list
const filtered = Array.isArray(prices)
  ? prices.filter(p => safeString(p?.name).toLowerCase().includes(safeString(search).toLowerCase()))
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

            {/* Loading indicator */}
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
                    <div>{p?.itemCode || ''}</div>
                    <div>{p?.name || ''}</div>
                    <div>{p?.basePrice || ''}</div>
                    <div>{p?.perTax || ''}%</div>
                    <div>{calculateNetRate(p?.basePrice , p?.perTax)}</div>
                    <div>{p?.Date || ''}</div>

                        <div className="status">
                            <span
                                className={`status-badge ${
                                    p?.status === "Active" ? "active" : "inactive"
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
                                onClick={() => handleDelete(p._id || p.id)}
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
                                    value={calculateNetRate(newPrice.basePrice , newPrice.perTax)}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>

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