import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTransaction } from '../../context/TransactionContext';
import { useSKU } from '../../context/SKUContext';
import { useSalesman } from '../../context/SalesmanContext';
import "./transaction.css";

const LoadOut = () => {
    const { loading, addLoadout } = useTransaction();
    const { items, getAllItems } = useSKU();
    const { salesmans, getAllSalesmen } = useSalesman();

    const modalCodeRef = useRef(null);
    const modalDateRef = useRef(null);
    const modalTripRef = useRef(null);
    const modalItemRef = useRef(null);
    const modalQtyRef = useRef(null);
    const saveRef = useRef(null);
    const addRef = useRef(null);

    const [newLoadItem, setNewLoadItem] = useState({
        itemCode: "",
        qty: 0
    });

    const [newLoadOut, setNewLoadOut] = useState({
        salesmanCode: "",
        date: "",
        trip: 1,
        items: []
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
        if (!newLoadItem.itemCode || newLoadItem.qty <= 0) {
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
            items: [...prev.items, newLoadItem]
        }));

        setNewLoadItem({ itemCode: "", qty: 0 });
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

        if (!newLoadOut.salesmanCode || !newLoadOut.date || newLoadOut.items.length == 0) {
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
            await addLoadout(paylaod);

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
                case "oty":
                    addRef.current?.focus();
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
                                <input
                                    type="text"
                                    placeholder='Enter Item code'
                                    value={newLoadItem.itemCode}
                                    ref={modalItemRef}
                                    onChange={(e) => setNewLoadItem({ ...newLoadItem, itemCode: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "item")}
                                />
                            </div>
                            <div className="form-group">
                                <label>Qty</label>
                                <input
                                    type="number"
                                    value={newLoadItem.qty}
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
                <div className="trans-table trans-grid">

                </div>
            </div>
            <button onClick={handleSubmit} className='trans-submit-btn'>Submit</button>
        </div>
    )
}

export default LoadOut
