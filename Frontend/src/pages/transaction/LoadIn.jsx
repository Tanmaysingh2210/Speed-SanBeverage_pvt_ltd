import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTransaction } from '../../context/TransactionContext';
import { useSKU } from '../../context/SKUContext';
import { useSalesman } from '../../context/SalesmanContext';
import "./transaction.css";

const LoadIn = () => {
    const { loading, addLoadIn } = useTransaction();
    const { items, getAllItems } = useSKU();
    const { salesmans, getAllSalesmen } = useSalesman();

    const modalCodeRef = useRef(null);
    const modalDateRef = useRef(null);
    const modalTripRef = useRef(null);
    const modalItemRef = useRef(null);
    const modalFilledRef = useRef(null);
    const modalBurstRef = useRef(null);

    const saveRef = useRef(null);
    const addRef = useRef(null);

    const [newLoadItem, setNewLoadItem] = useState({
        itemcode: "",
        Filled: null,
        Burst: null
    });

    const [newLoadIn, setNewLoadIn] = useState({
        salesmanCode: "",
        date: "",
        trip: 1,
        items: []
    });

    // derive matched salesman from current code so UI updates as user types
    const matchedSalesman = Array.isArray(salesmans)
        ? salesmans.find((sm) => String(sm.codeNo || sm.code || '').toUpperCase() === String(newLoadIn.salesmanCode || '').toUpperCase())
        : null;

    useEffect(() => {
        getAllItems();
        getAllSalesmen();
    }, []);


    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newLoadItem.itemcode || (newLoadItem.Filled <= 0 && newLoadItem.Burst <= 0)) {
            toast.error("Enter valid item code and filled quantity");
            return;
        }

        const exists = newLoadIn.items.find(
            (it) => String(it.itemCode || '').toUpperCase() === String(newLoadItem.itemcode || '').toUpperCase()
        );

        if (exists) {
            toast.error("Item already exist");
            return;
        }

        // normalize to server schema: itemCode, Filled, Burst
        const normalized = {
            itemCode: newLoadItem.itemcode,
            Filled: Number(newLoadItem.Filled) || 0,
            Burst: Number(newLoadItem.Burst) || 0,
        };

        setNewLoadIn((prev) => ({
            ...prev,
            items: [...prev.items, normalized]
        }));

        setNewLoadItem({ itemcode: "", Filled: 0, Burst: 0 });

    };

    const handleDelete = (code) => {
        setNewLoadIn((prev) => ({
            ...prev,
            items: prev.items.filter((it) => it.itemCode !== code)
        }));

        toast.success("Item removed");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newLoadIn.salesmanCode || !newLoadIn.trip || !newLoadIn.date || newLoadIn.items.length === 0) {
            toast.error("Fill all fields properly");
            return;
        }

        const paylaod = {
            salesmanCode: newLoadIn.salesmanCode,
            date: newLoadIn.date,
            trip: Number(newLoadIn.trip),
            items: newLoadIn.items
        };

        try {
            await addLoadIn(paylaod);

            setNewLoadIn({
                salesmanCode: "",
                date: "",
                trip: "",
                items: []
            });

        } catch (err) {
            console.error(err.response.data.message || "Error adding LoadIn");
        }
    };

    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "add") {
                addRef.current?.click();
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
                case "itemcode":
                    modalFilledRef.current?.focus();
                    break;
                case "Filled":
                    modalBurstRef.current?.focus();
                    break;
                case "Burst":
                    if (e.key === "Enter") {
                        addRef.current?.click();
                    } else {
                        addRef.current?.focus();
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
                case "itemcode":
                    modalTripRef.current?.focus();
                    break;
                case "Filled":
                    modalItemRef.current?.focus();
                    break;
                case "Burst":
                    modalFilledRef.current?.focus();
                    break;
                case "add":
                    modalBurstRef.current?.focus();
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
                                    value={newLoadIn.salesmanCode}
                                    onChange={(e) =>
                                        setNewLoadIn({ ...newLoadIn, salesmanCode: e.target.value })
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
                                    value={newLoadIn.date}
                                    onChange={(e) => setNewLoadIn({ ...newLoadIn, date: e.target.value })}
                                    ref={modalDateRef}
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                                />
                            </div>
                            <div className="form-group">
                                <label>Trip No.</label>
                                <input
                                    type="number"
                                    placeholder='Enter trip no.'
                                    value={newLoadIn.trip}
                                    ref={modalTripRef}
                                    onChange={(e) => setNewLoadIn({ ...newLoadIn, trip: e.target.value })}
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
                                    value={newLoadItem.itemcode}
                                    ref={modalItemRef}
                                    onChange={(e) => setNewLoadItem({ ...newLoadItem, itemcode: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "itemcode")}
                                />
                            </div>
                            <div className="form-group">
                                <label>Filled</label>
                                <input
                                    type="number"
                                    value={newLoadItem.Filled}
                                    ref={modalFilledRef}
                                    onChange={(e) => setNewLoadItem({ ...newLoadItem, Filled: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "Filled")}
                                    placeholder="Enter Qty/-"
                                />
                            </div>
                            <div className="form-group">
                                <label>Burst</label>
                                <input
                                    type="number"
                                    value={newLoadItem.Burst}
                                    ref={modalBurstRef}
                                    onChange={(e) => setNewLoadItem({ ...newLoadItem, Burst: e.target.value })}
                                    onKeyDown={(e) => handleKeyNav(e, "Burst")}
                                    placeholder="Enter Qty/-"
                                />
                            </div>



                            <button type="button" className="add-btn add-btn-load-in" onKeyDown={(e) => handleKeyNav(e, "add")} onClick={handleAddItem} ref={addRef} >
                               ➕ Add 
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
                            <div className="trans-loadin-table-grid trans-table-header">
                                {/* <div>SL.NO.</div> */}
                                <div>CODE</div>
                                <div>NAME</div>
                                <div>Filled</div>
                                <div>Burst</div>
                                <div>ACTION</div>
                            </div>
                            {loading && <div>Loading...</div>}

                            {newLoadIn.items.length > 0 ? (
                                newLoadIn.items.map((it, index) => {
                                    const matchedItem = items.find(
                                        (sku) => String(sku.code || '').toUpperCase() === String(it.itemCode || it.itemcode || '').toUpperCase()
                                    );
                                    return (
                                        <div key={index} className="trans-loadin-table-grid trans-table-row">
                                            <div>{it.itemCode}</div>
                                            <div>{matchedItem ? matchedItem.name : "-"}</div>
                                            <div>{it.Filled}</div>
                                            <div>{it.Burst}</div>
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
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default LoadIn
