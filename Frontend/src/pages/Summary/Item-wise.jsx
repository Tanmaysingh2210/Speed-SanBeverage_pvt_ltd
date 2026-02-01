import React from 'react';
import { useState, useEffect, useRef } from "react";
import "../transaction/transaction.css";
import api from "../../api/api";
import toast from "react-hot-toast";


const ItemWiseSummary = () => {

    const [period, setPeriod] = useState({ startDate: "", endDate: "" });
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [grandTotal, setGrandTotal] = useState(null);


    const getSummary = async (e) => {
        e.preventDefault();
        if (!period.startDate || !period.endDate || period.startDate > period.endDate) {
            toast.error("Fill both date properly");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/summary/itemwise', period);
            if (res?.data?.success) {
                setSummary(res?.data?.data);
                setGrandTotal(res?.data?.grandTotal.amount)
            }
            toast.success("item-wise summary fetch successfull");

        }
        catch (err) {
            toast.error(err.response?.data?.message || "Error fetching summary");
        }
        finally {
            setLoading(false);
        }
    }

    console.log("summary is:", summary);



    const startRef = useRef(null);
    const endRef = useRef(null);
    const findRef = useRef(null);

    useEffect(() => {
        startRef.current?.focus();
    }, []);


    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();
            if (e.key === "Enter" && currentField === "find") {
                findRef.current?.click();
                return;
            }
            switch (currentField) {
                case "startDate":
                    endRef.current?.focus();
                    break;
                case "endDate":
                    if (e.key === "Enter") {
                        findRef.current?.click();
                    } else {
                        findRef.current?.focus();
                    }
                    break;
                default:
                    break;
            }
        }
        else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "find":
                    endRef.current?.focus();
                    break;
                case "endDate":
                    startRef.current?.focus();
                    break;
                default:
                    break;
            }
        }
    }
let sumQty=0;

    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">
                        <div className="form-group">
                            <label>Start-date</label>
                            <input
                                ref={startRef}
                                value={period.startDate}
                                type="date"
                                onChange={(e) => setPeriod({ ...period, startDate: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "startDate")}
                            />
                        </div>
                        <div className="form-group">
                            <label>End-date</label>
                            <input
                                ref={endRef}
                                type="date"
                                onChange={(e) => setPeriod({ ...period, endDate: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "endDate")}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="padd trans-submit-btn"
                                disabled={loading}
                                ref={findRef}
                                onKeyDown={(e) => handleKeyNav(e, "find")}
                                onClick={getSummary}
                            >
                                {loading ? "Wait..." : "Find"}

                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trans-container set-margin">
                <div className="all-table">
                    <div className="all-row2 header">
                        <div>CODE</div>
                        <div>NAME</div>
                        <div>QUANTITY</div>
                        <div>AMOUNT</div>
                    </div>
                    {loading && (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            Fetching summary...
                        </div>
                    )}

                    {
                        summary.length === 0 && (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#666',
                                backgroundColor: 'white'
                            }}>
                                No items found
                            </div>
                        )
                    }
                    {/* Data Rows */}
                    {summary.map((p, i) => {

                         sumQty=sumQty+p.qty;
                        return (
                            <div key={i} className="all-row2">
                                <div>{p.itemCode}</div>
                                <div>{p.name}</div>
                                <div>{p.qty}</div>
                                <div>₹ {p.amount}</div>
                            </div>
                        )
                    })}
                    {summary.length > 0 && (
                        <div className="all-row4 total-row">
                            <div></div>
                            <div><strong>TOTAL</strong></div>
                            <div> {sumQty} </div>
                            <div><strong>₹ {grandTotal.toFixed(2)}</strong></div>
                        </div>
                    )}


                </div>

            </div>

        </div>
    )
}

export default ItemWiseSummary
