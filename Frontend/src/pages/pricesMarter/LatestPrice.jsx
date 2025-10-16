import React, { useState, useRef, useEffect } from "react";
import "./Prices.css";

const LatestPrice = () => {
    const itemList = [
        { code: "P200", name: "PEPSI 200ML BOTTLE" },
        { code: "M300", name: "MIRINDA 300ML CAN" },
        { code: "S100", name: "SLICE 100ML TETRA" },
    ];

    const [prices, setPrices] = useState([
        {
            id: 1,
            code: "P200",
            name: "PEPSI 200ML BOTTLE",
            basePrice: 500,
            perTax: 10,
            netRate: 550,
            date: "2025-10-16",
            status: "Active"
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [newPrice, setNewPrice] = useState({
        code: "",
        name: "",
        basePrice: "",
        perTax: "",
        date: "",
        netRate: "",
        status: "Active",
    });

    const codeRef = useRef(null);
    const baseRef = useRef(null);
    const taxRef = useRef(null);
    const dateRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);

    const modalRef = useRef(null);

    // Autofocus when modal opens
    useEffect(() => {
        if (showModal) {
            setTimeout(() => codeRef.current?.focus(), 100);
        }
    }, [showModal]);

    // Auto update name & net rate
    useEffect(() => {
        const found = itemList.find(
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
    }, [newPrice.code]);

    useEffect(() => {
        if (newPrice.basePrice && newPrice.perTax) {
            const net = (
                parseFloat(newPrice.basePrice) +
                (parseFloat(newPrice.basePrice) * parseFloat(newPrice.perTax)) / 100
            ).toFixed(2);
            setNewPrice((prev) => ({ ...prev, netRate: net }));
        }
    }, [newPrice.basePrice, newPrice.perTax]);

    // Handle navigation keys
    // const handleKeyNav = (e, currentField) => {
    //     const next = {
    //         code: baseRef,
    //         basePrice: taxRef,
    //         perTax: dateRef,
    //         date: saveRef,
    //     };
    //     const prev = {
    //         code:null,
    //         basePrice: codeRef,
    //         perTax: baseRef,
    //         date: taxRef,
    //         save: dateRef,
    //     };

    //     if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
    //         e.preventDefault();
    //         next[currentField]?.current?.focus();
    //     } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
    //         e.preventDefault();
    //         // prev[currentField]?.current?.focus();
    //         if (prev[currentField]?.current) {
    //              prev[currentField].current.focus();
    //         }
    //     }
    // };

    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "save") {
                e.preventDefault();
                saveRef.current?.click();
            }

            // If Enter is pressed on the Save button, click it
            if (currentField === "save" && e.key === "Enter") {
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
                        saveRef.current?.click(); // trigger save
                    } else {
                        saveRef.current?.focus(); // for arrow keys
                    }
                    break;
                default:
                    break;
            }
        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "code":
                    break;
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



   

    const handleSave = (e) => {
        e.preventDefault();

        const found = itemList.find(
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

        if (editId) {
            setPrices(prices.map((p) => (p.id === editId ? newPrice : p)));
        } else {
            const data = {
                id: Date.now(),
                ...newPrice,
            };
            setPrices([...prices, data]);
        }

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
    };

    const handleDelete = (id) => {
        setPrices(prices.filter((p) => p.id !== id));
    };

    const handleEdit = (price) => {
        setEditId(price.id);
        setNewPrice({...price});
        setShowModal(true);
    };

    const filtered = prices.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

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
                    <button className="price-add-btn" onClick={() => {
                        setShowModal(true);
                        setEditId(null); // Reset editId
                        setNewPrice({   // Reset form fields
                            code: "",
                            name: "",
                            basePrice: "",
                            perTax: "",
                            date: "",
                            netRate: "",
                            status:"Active",
                        });
                    }}>
                        + New Price
                    </button>
                </div>

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

                    {filtered.map((p, i) => (
                        <div key={p.id} className="price-row">
                            <div>{i + 1}</div>
                            <div>{p.code.toUpperCase()}</div>
                            <div>{p.name}</div>
                            <div>{p.basePrice}</div>
                            <div>{p.perTax}%</div>
                            <div>{p.netRate}</div>
                            <div>{p.date}</div>
                            <div>
                                <span
                                    className={`status-badge ${p.status === "Active" ? "active" : "inactive"
                                        }`}
                                >
                                    {p.status}
                                </span>
                            </div>

                            {/* <div>{p.status}</div> */}
                            <div className="actions">
                                <span className="edit" onClick={() => handleEdit(p)}>
                                    Edit
                                </span>{" "}
                                |{" "}
                                <span className="delete" onClick={() => handleDelete(p.id)}>
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
                                        value={newPrice.netRate}
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
    );
};

export default LatestPrice;