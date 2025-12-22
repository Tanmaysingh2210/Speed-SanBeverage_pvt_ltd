import React from 'react';
import { useState, useEffect, useRef } from "react";
import "../transaction/transaction.css";
import api from "../../api/api";
import toast from "react-hot-toast";

const EmtAndMtSummary = () => {

    const [period, setPeriod] = useState({ startDate: "", endDate: "" });
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSummary = async (e) => {
        e.preventDefault();
        if (!period.startDate || !period.endDate || period.startDate > period.endDate) {
            toast.error("Fill both date properly");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/summary/emtandmt', period);
            if (res?.data?.success) {
                setSummary(res?.data?.data);
            }
            toast.success("Emt and mt fetch successfully");
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Error fetching summary");
        }
        finally {
            setLoading(false);
        }
    }

    
    let grandTotalShortExcess=0;

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
                                value={period.endDate}
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
                    <div className="all-row3 header">
                        <div>CODE</div>
                        <div>SALESMAN NAME</div>
                        <div>MT</div>
                        <div>EMT</div>
                        <div>SHORT/EXCESS</div>
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
                        const rowTotal = Number(p.totalEmt || 0) - Number(p.totalMt || 0);
                      grandTotalShortExcess+=rowTotal;
                        return (
                            <div key={i} className="all-row3">
                                <div>{p.salesmanCode}</div>
                                <div>{p.name}</div>
                                <div>{p.totalMt}</div>
                                <div>{p.totalEmt}</div>


                                {(rowTotal >= 0) &&


                                    (<div style={{
                                        color: "green"
                                    }}> {rowTotal.toFixed(2)}</div>)}

                                {(rowTotal < 0) &&
                                    (
                                    <div style={{
                                        color: "red"
                                    }}> {rowTotal.toFixed(2)}</div>)}


                            </div>
                        )
                    })}
                    {summary.length > 0 && (
                        <div className="all-row3 total-row">
                            <div></div>
                            <div><strong>TOTAL</strong></div>

                            {
                                grandTotalShortExcess>0 &&
                                <div style={{
                                color:"green"
                            }}><strong>{grandTotalShortExcess.toFixed(2)}</strong></div>
                            }
                            { 
                            grandTotalShortExcess<0 &&
                            <div style={{
                                color:"red"
                            }}><strong>{grandTotalShortExcess.toFixed(2)}</strong></div>
                        }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default EmtAndMtSummary; 