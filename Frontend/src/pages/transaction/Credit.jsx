import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTransaction } from '../../context/TransactionContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSKU } from '../../context/SKUContext';
import { useSalesman } from '../../context/SalesmanContext';
import "./transaction.css";


const Credit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, addCash_credit, updateCash_credit } = useTransaction();
    const { salesmans, getAllSalesmen } = useSalesman();


    const editMode = location.state?.editMode || false;
    const editData = location.state?.editData || null;

    const [newCredit, setNewCredit] = useState({
        crNo: editData?.crNo || 1,
        salesmanCode: editData?.salesmanCode || "",
        date: editData?.date ? editData?.date.split('T')[0] : "",
        trip: editData?.trip || 1,
        value: editData?.value || null,
        tax: editData?.tax || null,
        cashDeposited: editData?.cashDeposited || null,
        chequeDeposited: editData?.chequeDeposited || null,
        ref: editData?.ref || null,
        remark: editData?.remark || ""
    });

    const codeRef = useRef(null);
    const dateRef = useRef(null);
    const tripRef = useRef(null);
    const valueRef = useRef(null);
    const taxref = useRef(null);
    const remarkRef = useRef(null);
    const submitRef = useRef(null);
    const cashRef = useRef(null);
    const defRef = useRef(null);
    const chequeRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCredit.salesmanCode || !newCredit.trip || !newCredit.date || !newCredit.tax || !newCredit.value) {
            toast.error("Fill all fields properly");
            return;
        }
        const payload = {
            crNo: Number(newCredit.crNo) || 1,
            salesmanCode: newCredit.salesmanCode,
            date: newCredit.date,
            trip: Number(newCredit.trip) || 1,
            value: Number(newCredit.value) || 0,
            tax: Number(newCredit.tax) || 0,
            ref: Number(newCredit.ref) || 0,
            cashDeposited: Number(newCredit.cashDeposited) || 0,
            chequeDeposited: Number(newCredit.chequeDeposited) || 0,
            remark: newCredit.remark || ""
        }
        try {
            if (editData && editMode) {
                await updateCash_credit(editData._id , payload);
                setTimeout(() => {
                    navigate('/transaction/all-transaction')
                }, 100);
            } else {
                await addCash_credit(payload);
            }
            setNewCredit({
                crNo: null,
                salesmanCode: "",
                date: "",
                trip: 1,
                value: null,
                tax: null,
                cashDeposited: null,
                chequeDeposited: null,
                ref: null,
                remark: ""
            });
        } catch (err) {
            console.error(err.response.data.message || "Error adding Cash/Credit");
        }
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? changes will be lost.")) {
            navigate('/transaction/all-transaction');
        }
    };

    const calculateNetValue = (value, tax) => {
        if (!value || !tax) return '';
        return (parseFloat(value) + (parseFloat(value) * parseFloat(tax) / 100)).toFixed(2)
    };


    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "save") {
                submitRef.current?.click();
                return;
            }

            switch (currentField) {
                case "date":
                    codeRef.current?.focus();
                    break;
                case "code":
                    tripRef.current?.focus();
                    break;
                case "trip":
                    valueRef.current?.focus();
                    break;
                case "value":
                    taxref.current?.focus();
                    break;
                case "tax":
                    remarkRef.current?.focus();
                    break;
                case "remark":
                    defRef.current?.focus();
                    break;
                case "ref":
                    cashRef.current?.focus();
                    break;
                case "cash":
                    chequeRef.current?.focus();
                    break;
                case "cheque":
                    if (e.key === "Enter") {
                        submitRef.current?.click();
                    } else {
                        submitRef.current?.focus();
                    }
                    break;
                default:
                    break;
            }
        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "code":
                    dateRef.current?.focus();
                    break;
                case "trip":
                    codeRef.current?.focus();
                    break;
                case "value":
                    tripRef.current?.focus();
                    break;
                case "tax":
                    valueRef.current?.focus();
                    break;
                case "remark":
                    taxref.current?.focus();
                    break;
                case "ref":
                    remarkRef.current?.focus();
                    break;
                case "cash":
                    defRef.current?.focus();
                    break;
                case "cheque":
                    cashRef.current?.focus();
                    break;
                case "save":
                    chequeRef.current?.focus();
                    break;
                default:
                    break;
            }
        }
    };

    const matchedSalesman = Array.isArray(salesmans)
        ? salesmans.find((sm) => String(sm.codeNo || sm.code || '').toUpperCase() === String(newCredit.salesmanCode || '').toUpperCase())
        : null;



    return (
        <div className="trans">
            <div className="trans-container">
                <div className="trans-left">
                    <form className="trans-form">
                        <div className="form-group">
                            <label>Cash/Credit</label>
                            <select
                                value={newCredit.crNo || ""}
                                onChange={(e) => setNewCredit({ ...newCredit, crNo: Number(e.target.value) })}
                            >
                                <option value={1}>cash</option>
                                <option value={2}>credit</option>
                            </select>
                        </div>
                        <div className="form-group date-input">
                            <label>Date</label>
                            <input
                                type="date"
                                ref={dateRef}
                                value={newCredit.date}
                                onChange={(e) => setNewCredit({ ...newCredit, date: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "date")}
                            />
                        </div>
                        <div className="form-group">
                            <label>Salesman Code</label>
                            <input
                                type="text"
                                placeholder="Enter Salesman Code"
                                ref={codeRef}
                                value={newCredit.salesmanCode}
                                onChange={(e) => setNewCredit({ ...newCredit, salesmanCode: e.target.value })}
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

                    </form>

                    <div className="item-inputs middle-inputs">
                        <div className="form-group">
                            <label>Trip</label>
                            <input
                                type="number"
                                ref={tripRef}
                                placeholder="Enter Trip no."
                                value={newCredit.trip}
                                onChange={(e) => setNewCredit({ ...newCredit, trip: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "trip")}
                            />
                        </div>
                        <div className="form-group">
                            <label>Value</label>
                            <input
                                type="number"
                                ref={valueRef}
                                value={newCredit.value || ""}
                                placeholder="Enter Value"
                                onChange={(e) => setNewCredit({ ...newCredit, value: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "value")}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tax</label>
                            <input
                                type="number"
                                ref={taxref}
                                value={newCredit.tax || ""}
                                placeholder="% Tax"
                                onChange={(e) => setNewCredit({ ...newCredit, tax: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "tax")}
                            />
                        </div>
                        <div className="form-group">
                            <label>Net Value</label>
                            <input
                                readOnly
                                type="number"
                                value={calculateNetValue(newCredit?.value, newCredit?.tax)}
                                style={{ backgroundColor: "#f5f5f5" }}
                            />
                        </div>
                        <div className="form-group expand-grp" >
                            <label>Remark</label>
                            <input
                                type="text"
                                value={newCredit.remark || ""}
                                onChange={(e) => setNewCredit({ ...newCredit, remark: e.target.value })}
                                ref={remarkRef}
                                onKeyDown={(e) => handleKeyNav(e, "remark")}
                            />
                        </div>

                    </div>

                    <div className="item-inputs">
                        <div className="form-group">
                            <label>DEP/REF</label>
                            <input
                                type="number"
                                ref={defRef}
                                value={newCredit.ref || ""}
                                placeholder="DEP/REF"
                                onChange={(e) => setNewCredit({ ...newCredit, ref: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "ref")}
                            />
                        </div>
                        <div className="form-group">
                            <label>CASH DEPOSITED</label>
                            <input
                                type="number"
                                ref={cashRef}
                                value={newCredit.cashDeposited || ""}
                                placeholder="Cash deposited"
                                onChange={(e) => setNewCredit({ ...newCredit, cashDeposited: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "cash")}
                            />
                        </div>
                        <div className="form-group">
                            <label>CHEQUE DEPOSITED</label>
                            <input
                                type="number"
                                ref={chequeRef}
                                value={newCredit.chequeDeposited || ""}
                                placeholder="Cheque deposited"
                                onChange={(e) => setNewCredit({ ...newCredit, chequeDeposited: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "cheque")}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex hidden">
                <button
                    className='trans-submit-btn'
                    ref={submitRef}
                    onClick={handleSubmit}
                    onKeyDown={(e) => handleKeyNav(e, "save")}
                    disabled={loading}
                >
                    {loading ? "Loading..." : editMode ? "Update" : "Submit"}
                </button>
                <button
                    className="trans-cancel-btn"
                    onClick={handleCancel}
                    style={editMode ? { display: "block" } : { display: "none" }}
                    disabled={loading}
                >
                    cancel
                </button>
            </div>
        </div>
    );
}
export default Credit;