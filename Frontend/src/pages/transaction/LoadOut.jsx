import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTransaction } from '../../context/TransactionContext';
import { useSKU } from '../../context/SKUContext';
import { useSalesman } from '../../context/SalesmanContext';
import "./transaction.css";
import { useSalesmanModal } from '../../context/SalesmanModalContext';


const LoadOut = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [modalQtyMap, setModalQtyMap] = useState({});


    const [itemShow, setItemShow] = useState(false);
    const [search, setSearch] = useState("");
    const { loading, addLoadout, updateLoadout } = useTransaction();
    const { items, getAllItems } = useSKU();
    const { salesmans, getAllSalesmen } = useSalesman();

    const { openSalesmanModal } = useSalesmanModal();

    const editMode = location.state?.editMode || false;
    const editData = location.state?.editData || null;

    const modalCodeRef = useRef(null);
    const modalDateRef = useRef(null);
    const modalTripRef = useRef(null);
    const modalItemRef = useRef(null);
    const modalQtyRef = useRef(null);

    const saveRef = useRef(null);
    const addRef = useRef(null);

    const [newLoadItem, setNewLoadItem] = useState({
        itemCode: "",
        qty: ""
    });

    const [newLoadOut, setNewLoadOut] = useState({
        salesmanCode: editData?.salesmanCode || "",
        date: editData?.date ? editData.date.split('T')[0] : "",
        trip: editData?.trip || 1,
        items: editData?.items || []
    });

    // derive matched salesman from current code so UI updates as user types
    const matchedSalesman = Array.isArray(salesmans)
        ? salesmans.find((sm) => String(sm.codeNo || sm.code || '').toUpperCase() === String(newLoadOut.salesmanCode || '').toUpperCase())
        : null;

    useEffect(() => {
        getAllItems();
        getAllSalesmen();
    }, []);




    const handleAddItem = () => {
        const qtyNum = Number(newLoadItem.qty);
        if (!newLoadItem.itemCode || !newLoadItem.qty || qtyNum <= 0) {
            toast.error("Enter valid item code and quantity");
            return;
        }

        const exists = newLoadOut.items.find(
            (it) => it.itemCode.toUpperCase() === newLoadItem.itemCode.toUpperCase()
        );

        if (exists) {
            toast.error("Item already exist");
            return;
        }

        setNewLoadOut((prev) => ({
            ...prev,
            items: [...prev.items, { ...newLoadItem, qty: qtyNum }]
        }));

        setNewLoadItem({ itemCode: "", qty: "" });
        modalItemRef.current?.focus();
    };

    const handleDelete = (code) => {
        setNewLoadOut((prev) => ({
            ...prev,
            items: prev.items.filter((it) => it.itemCode !== code)
        }));

        toast.success("Item removed");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!newLoadOut.salesmanCode || !newLoadOut.date || newLoadOut.trip <= 0 || newLoadOut.items.length == 0) {
            toast.error("Fill all fields properly");
            return;
        }
        const paylaod = {
            salesmanCode: newLoadOut.salesmanCode,
            date: newLoadOut.date,
            trip: newLoadOut.trip,
            items: newLoadOut.items
        };

        try {
            if (editMode && editData) {
                await updateLoadout(editData._id, paylaod);
                setTimeout(() => {
                    navigate('/transaction/all-transaction');
                }, 100);
            } else {
                await addLoadout(paylaod);
            }

            setNewLoadOut({
                salesmanCode: "",
                date: "",
                trip: "",
                items: []
            });

        } catch (err) {
            console.error(err.response.data.message || "Error adding loadout");
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? changes will be lost.')) {
            navigate('/transaction/all-transaction');
        }
    };


    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "save") {
                saveRef.current?.click();
                return;
            }

            switch (currentField) {
                case "code":
                    modalDateRef.current?.focus();
                    break;
                case "date":
                    modalTripRef.current?.focus();
                    break;
                case "trip":
                    modalItemRef.current?.focus();
                    break;
                case "item":
                    modalQtyRef.current?.focus();
                    break;
                case "qty":
                    if (e.key === "Enter") addRef.current?.click();
                    else addRef.current?.focus();
                    break;
                case "add":
                    if (e.key === "Enter") addRef.current?.click();
                    else saveRef.current?.focus();
                    break;
                default:
                    break;
            }
        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "date":
                    modalCodeRef.current?.focus();
                    break;
                case "trip":
                    modalDateRef.current?.focus();
                    break;
                case "item":
                    modalTripRef.current?.focus();
                    break;
                case "qty":
                    modalItemRef.current?.focus();
                    break;
                case "add":
                    modalQtyRef.current?.focus();
                    break;
                case "save":
                    addRef.current?.focus();
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <div className="trans">
            <div className='trans-container'>
                <div className="trans-left">
                    <form className='trans-form' >
                        <div className="salesman-detail">
                            <div className="form-group">
                                <label>Salesman Code</label>

                                <div className="input-with-btn">
                                    <input
                                        type="text"
                                        placeholder="Enter Salesman code"
                                        value={newLoadOut.salesmanCode}
                                        onChange={(e) =>
                                            setNewLoadOut({ ...newLoadOut, salesmanCode: e.target.value })
                                        }
                                        ref={modalCodeRef}
                                        onKeyDown={(e) => handleKeyNav(e, "code")}
                                    />

                                    <button
                                        type="button"
                                        className="dropdown-btn"
                                        onClick={() =>
                                            openSalesmanModal((code) =>
                                                setNewLoadOut(prev => ({ ...prev, salesmanCode: code }))
                                            )
                                        }
                                    >
                                        ⌄
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Salesman Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={matchedSalesman ? matchedSalesman.name : ""}
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Route No.</label>
                                <input
                                    readOnly
                                    type="number"
                                    value={matchedSalesman ? matchedSalesman.routeNo : ""}
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={newLoadOut.date}
                                    onChange={(e) => setNewLoadOut({ ...newLoadOut, date: e.target.value })}
                                    ref={modalDateRef}
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                                />
                            </div>
                            <div className="form-group">
                                <label>Trip No.</label>
                                <input
                                    type="number"
                                    placeholder='Enter trip no.'
                                    value={newLoadOut.trip}
                                    ref={modalTripRef}
                                    onChange={(e) => setNewLoadOut({ ...newLoadOut, trip: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "trip")}
                                />
                            </div>
                        </div>
                    </form>

                    <div className="item-inputs">
                        <div className="flex">
                            <div className="form-group">
                                    <label>Item Code</label>
                                <div className="input-with-btn">
                                    <input
                                        type="text"
                                        placeholder='Enter Item code'
                                        value={newLoadItem.itemCode}
                                        ref={modalItemRef}
                                        onChange={(e) => setNewLoadItem({ ...newLoadItem, itemCode: e.target.value })}
                                        onKeyDown={(e) => handleKeyNav(e, "item")}
                                    />
                                    <button
                                        type="button"
                                        className="dropdown-btn"
                                        onClick={() =>
                                            setItemShow(true)

                                        }
                                    >
                                        ⌄
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Qty</label>
                                <input
                                    type="number"
                                    value={newLoadItem.qty}
                                    placeholder='Enter qty'
                                    ref={modalQtyRef}
                                    onChange={(e) => setNewLoadItem({ ...newLoadItem, qty: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "qty")}
                                />
                            </div>
                            <button type="button" className="add-btn" onKeyDown={(e) => handleKeyNav(e, "add")} onClick={handleAddItem} ref={addRef} >
                                ➕ Add Item
                            </button>
                        </div>
                        {/* <div className="form-group">
                        <label>Item Name</label>
                        <input
                            readOnly
                            type="text"
                            style={{ backgroundColor: "#f5f5f5" }}
                        />
                    </div> */}
                        <div className="table">
                            <div className="trans-table-grid trans-table-header">
                                {/* <div>SL.NO.</div> */}
                                <div>CODE</div>
                                <div>NAME</div>
                                <div>Qty</div>
                                <div>ACTION</div>
                            </div>
                            {loading && <div>Loading...</div>}

                            {newLoadOut.items.length > 0 ? (
                                newLoadOut.items.map((it, index) => {
                                    const matchedItem = items.find(
                                        (sku) => sku.code.toUpperCase() === it.itemCode.toUpperCase()
                                    );
                                    return (
                                        <div key={index} className="trans-table-grid trans-table-row">
                                            <div>{it.itemCode}</div>
                                            <div>{matchedItem ? matchedItem.name : "-"}</div>
                                            <div>{it.qty}</div>
                                            <div className="actions">
                                                <span
                                                    className="delete"
                                                    onClick={() => handleDelete(it.itemCode)}
                                                >
                                                    Delete
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-items">No Items added yet!</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex hidden">
                <button
                    onClick={handleSubmit}
                    ref={saveRef}
                    onKeyDown={(e) => handleKeyNav(e, "save")}
                    disabled={loading}
                    className='trans-submit-btn'
                >
                    {loading ? "Saving..." : editMode ? 'Update' : 'Submit'}
                </button>
                <button
                    className="trans-cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                    style={editMode ? { display: "block" } : { display: "none" }}
                >
                    Cancel
                </button>
            </div>

            {/* item modal */}

            {itemShow && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Select Items</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => setItemShow(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            className="modal-search"
                            placeholder="Search by code or name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <div className="modal-table">
                            <div className="modal-row4 modal-head">
                                <div>Code</div>
                                <div>Name</div>
                                <div>Status</div>
                                <div>Qty</div>
                            </div>

                            {items
                                .filter(itm => itm.container !== "EMT")
                                .filter(itm =>
                                    itm.code.toLowerCase().includes(search.toLowerCase()) ||
                                    itm.name.toLowerCase().includes(search.toLowerCase())
                                )
                                .map(itm => (
                                    <div key={itm._id} className="modal-row4">
                                        <div>{itm.code}</div>
                                        <div>{itm.name}</div>

                                        <div
                                            className={`status-badge ${itm.status === "Inactive" ? "inactive" : "active"
                                                }`}
                                        >
                                            {itm.status}
                                        </div>

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Qty"
                                            value={modalQtyMap[itm.code] || ""}
                                            onChange={(e) =>
                                                setModalQtyMap(prev => ({
                                                    ...prev,
                                                    [itm.code]: e.target.value
                                                }))
                                            }
                                            style={{
                                                width: "70px",
                                                padding: "6px 8px",
                                                backgroundColor: "#fff",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "6px",
                                                color: "#111",
                                                fontSize: "14px"
                                            }}
                                        />
                                    </div>
                                ))}

                            <button
                                className="add-btn"
                                onClick={() => {
                                    const itemsToAdd = Object.entries(modalQtyMap)
                                        .filter(([_, qty]) => Number(qty) > 0)
                                        .map(([code, qty]) => ({
                                            itemCode: code,
                                            qty: Number(qty)
                                        }));

                                    if (itemsToAdd.length === 0) {
                                        toast.error("Enter qty for at least one item");
                                        return;
                                    }

                                    setNewLoadOut(prev => ({
                                        ...prev,
                                        items: [...prev.items, ...itemsToAdd]
                                    }));

                                    setModalQtyMap({});
                                    setItemShow(false);
                                }}
                            >
                                Add Items
                            </button>


                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}

export default LoadOut
