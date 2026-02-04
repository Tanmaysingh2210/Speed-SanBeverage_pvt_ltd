import React, { useState, useEffect, useRef } from 'react';
import "../transaction/transaction.css";
import api from '../../api/api';
import { useSKU } from '../../context/SKUContext';
import { useToast } from '../../context/ToastContext';
import "../transaction/transaction.css";

const PurchaseItemwise = () => {
    const { showToast } = useToast();
    const { items: skuItems } = useSKU();
    const [items, setItems] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [itemShow, setItemShow] = useState(false);
    const [search, setSearch] = useState("");

    const [modalQtyMap, setModalQtyMap] = useState({});
    const [modalExpiryMap, setModalExpiryMap] = useState({});

    const [loading, setLoading] = useState(false);
    const modalDateRef = useRef(null);
    const modalCodeRef = useRef(null);
    const modalQtyRef = useRef(null);
    const modalExpDateRef = useRef(null);
    const modalAddRef = useRef(null)
    const modalSubmitRef = useRef(null)

    const [formData, setFormData] = useState({
        date: '',
        itemCode: '',
        qty: '',
        expiryDate: ''
    });

    const getItemName = (code) => {
        const item = skuItems.find(sku => sku.code.toLowerCase() === code.toLowerCase());
        return item ? item.name : 'Unknown Item';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.date) {
            showToast('Please select a date', 'error');
            return false;
        }
        if (!formData.itemCode) {
            showToast('Please enter item code', 'error');
            return false;
        }
        if (!formData.qty || isNaN(formData.qty) || parseInt(formData.qty) <= 0) {
            showToast('Please enter valid quantity', 'error');
            return false;
        }
        if (!formData.expiryDate) {
            showToast('Please select expiry date', 'error');
            return false;
        }

        const itemExists = skuItems.some(sku => sku.code.toLowerCase() === formData.itemCode.toLowerCase());
        if (!itemExists) {
            showToast('Item code not found in SKU items', 'error');
            return false;
        }

        return true;
    };

    const handleAddItem = () => {
        if (!validateForm()) return;

        const newItem = {
            ...formData,
            name: getItemName(formData.itemCode),
            id: Date.now() 
        };

        if (editingIndex !== null) {
            const updatedItems = [...items];
            updatedItems[editingIndex] = newItem;
            setItems(updatedItems);
            setEditingIndex(null);
            showToast('Item updated successfully', 'success');
        } else {
            setItems([...items, newItem]);
            showToast('Item added successfully', 'success');
        }

        setFormData({
            date: formData.date,
            itemCode: '',
            qty: '',
            expiryDate: ''
        });
    };

    const handleEdit = (index) => {
        const item = items[index];
        setFormData({
            date: item.date,
            itemCode: item.itemCode,
            qty: item.qty,
            expiryDate: item.expiryDate
        });
        setEditingIndex(index);
        showToast('Edit mode activated', 'success');
    };

    const handleDelete = (index) => {
        if (true) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
            showToast('Item deleted successfully', 'success');

            if (editingIndex === index) {
                setEditingIndex(null);
                setFormData({
                    date: '',
                    itemCode: '',
                    qty: '',
                    expiryDate: ''
                });
            }
        }
    };

    const handleSubmit = async () => {
        if (items.length === 0) {
            showToast('Please add at least one item', 'error');
            return;
        }

        const mainDate = items[0].date;
        const allSameDate = items.every(item => item.date === mainDate);

        if (!allSameDate) {
            showToast('All items must have the same purchase date', 'error');
            return;
        }

        const formattedItems = items.map(item => ({
            itemCode: item.itemCode,
            qty: parseInt(item.qty),
            expiryDate: item.expiryDate
        }));

        const finalPayload = {
            date: mainDate,
            items: formattedItems
        };

        console.log('Sending payload:', finalPayload); 

        setLoading(true);
        try {
            const response = await api.post('/purchase/itemwise', finalPayload);

            if (response.data) {
                showToast('Purchase saved successfully', 'success');
                setItems([]);
                setFormData({
                    date: '',
                    itemCode: '',
                    qty: '',
                    expiryDate: ''
                });
            }
        } catch (error) {
            console.error('Error saving purchase:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save purchase';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };




    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "submit") {
                modalSubmitRef.current?.click();
                return;
            }

            switch (currentField) {
                case "date":
                    modalCodeRef.current?.focus();
                    break;
                case "itemcode":
                    modalQtyRef.current?.focus();
                    break;
                case "qty":
                    modalExpDateRef.current?.focus();
                    break;
                case "expdate":
                    if (e.key === "Enter") {
                        modalAddRef.current?.click();
                    } else {
                        modalAddRef.current?.focus();
                    }
                    break;
                case "add":
                    if (e.key === "Enter") {
                        modalAddRef.current?.click();
                        modalSubmitRef.current?.focus();
                    }
                    else {
                        modalSubmitRef.current?.focus();
                    }
                    break;
                case "submit":
                    modalDateRef.current?.focus();
                    break;
                default:
                    break;
            }

        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "add":
                    modalExpDateRef.current?.focus();
                    break;
                case "expdate":
                    modalQtyRef.current?.focus();
                    break;
                case "qty":
                    modalCodeRef.current?.focus();
                    break;
                case "itemcode":
                    modalDateRef.current?.focus();
                    break;
                case "submit":
                    modalAddRef.current?.focus();
                    break;
                case "date":
                    modalSubmitRef.current?.focus();
                    break;


            }
        }
    }

    return (
        <div className="trans">

            <div className='trans-container'>
                <div className="trans-left">

                    <div className="item-inputs">
                        <div className="flex">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    ref={modalDateRef}
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                                />
                            </div>
                            <div className="form-group">
                                <label>Item Code</label>
                                <div className="input-with-btn">
                                    <input
                                        type="text"
                                        name="itemCode"
                                        placeholder='Enter Item code'
                                        value={formData.itemCode}
                                        onChange={handleInputChange}
                                        ref={modalCodeRef}
                                        onKeyDown={(e) => handleKeyNav(e, "itemcode")}
                                    />
                                    <button
                                        type="button"
                                        className="dropdown-btn"
                                        onClick={() => setItemShow(true)}
                                    >
                                        ⌄
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Qty</label>
                                <input
                                    type="number"
                                    name="qty"
                                    placeholder='Enter qty'
                                    value={formData.qty}
                                    onChange={handleInputChange}
                                    min="1"
                                    ref={modalQtyRef}
                                    onKeyDown={(e) => handleKeyNav(e, "qty")}

                                />
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    ref={modalExpDateRef}
                                    onKeyDown={(e) => handleKeyNav(e, "expdate")}
                                />
                            </div>
                            <button type="button" className=" add-btn" onClick={handleAddItem}
                                ref={modalAddRef}
                                onKeyDown={(e) => handleKeyNav(e, "add")}>
                                ➕ {editingIndex !== null ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>

                        <div className="table">
                            <div className="trans-table-grid-purchaseItemwise trans-table-header-purchaseItemwise">
                                <div>CODE</div>
                                <div>NAME</div>
                                <div>Qty</div>
                                <div>Expiry</div>
                                <div>ACTION</div>
                            </div>
                            {items.length === 0 ? (
                                <div className="empty-state">
                                    No items added yet. Add items using the form above.
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={item.id} className="trans-table-grid-purchaseItemwise table-row">
                                        <div>{item.itemCode}</div>
                                        <div>{item.name}</div>
                                        <div>{item.qty}</div>
                                        <div>{new Date(item.expiryDate).toLocaleDateString()}</div>
                                        <div className="actions">
                                            <span className="edit" onClick={() => handleEdit(index)}>
                                                Edit
                                            </span>
                                            {" | "}
                                            <span className="delete" onClick={() => handleDelete(index)}>
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div>



                </div>
            </div>
            <div className="hidden flex">
                <button
                    className='trans-submit-btn'
                    onClick={handleSubmit}
                    disabled={loading || items.length === 0}
                    ref={modalSubmitRef}
                    onKeyDown={(e) => handleKeyNav(e, "submit")}
                >
                    {loading ? 'Saving...' : 'Submit'}
                </button>
            </div>
            {itemShow && (
                <div className="modal-overlay">
                    <div className="modal-box-itemwise">

                        <div className="modal-header">
                            <h3>Select Items</h3>
                            <button className="modal-close-btn" onClick={() => setItemShow(false)}>
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
                            <div className="modal-row5-itemwise-head modal-head">
                                <div>Code</div>
                                <div>Name</div>
                                <div>Status</div>
                                <div>Qty</div>
                                <div>Expiry</div>
                            </div>

                            {skuItems
                                .filter(itm =>
                                    !itm.code.toLowerCase().includes("emt") &&   
                                    (
                                        itm.code.toLowerCase().includes(search.toLowerCase()) ||
                                        itm.name.toLowerCase().includes(search.toLowerCase())
                                    )
                                )
                                .map(itm => (
                                    <div key={itm._id} className="modal-row5-itemwise">
                                        <div>{itm.code}</div>
                                        <div>{itm.name}</div>

                                        <div className={`status-badge ${itm.status === "Inactive" ? "inactive" : "active"}`}>
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
                                            className="modal-qty-input"

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

                                        <input
                                            type="date"
                                            value={modalExpiryMap[itm.code] || ""}
                                            onChange={(e) =>
                                                setModalExpiryMap(prev => ({
                                                    ...prev,
                                                    [itm.code]: e.target.value
                                                }))
                                            }
                                            className="modal-exp-input"

                                            style={{
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
                        </div>

                        <button
                            className="add-btn"
                            onClick={() => {
                                const itemsToAdd = skuItems
                                    .map(itm => {
                                        const qty = Number(modalQtyMap[itm.code]) || 0;
                                        const expiry = modalExpiryMap[itm.code];

                                        if (qty <= 0 || !expiry) return null;

                                        return {
                                            itemCode: itm.code,
                                            name: itm.name,
                                            qty,
                                            expiryDate: expiry,
                                            date: formData.date,
                                            id: Date.now() + Math.random()
                                        };
                                    })
                                    .filter(Boolean);

                                if (itemsToAdd.length === 0) {
                                    showToast("Enter qty and expiry for at least one item", 'error');
                                    return;
                                }

                                setItems(prev => [...prev, ...itemsToAdd]);

                                setModalQtyMap({});
                                setModalExpiryMap({});
                                setItemShow(false);
                            }}
                        >
                            Add Items
                        </button>

                    </div>
                </div>
            )}

        </div>
    )
}

export default PurchaseItemwise
