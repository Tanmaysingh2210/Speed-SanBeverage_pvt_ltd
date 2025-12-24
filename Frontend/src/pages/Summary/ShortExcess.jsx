import React from 'react'
import api from "../../api/api.js";
import { useState, useEffect } from 'react';
import "../transaction/transaction.css";
import { useSalesman } from '../../context/SalesmanContext.jsx';

const ShortExcess = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getAllSalesmen } = useSalesman();

    const handleFind = async () => {
        if (!startDate || !endDate) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await api.get(
                `/summary/short-excess-summary?startDate=${startDate}&endDate=${endDate}`
            );

            console.log("SUMMARY DATA:", res.data); // 👈 must see this
            setRows(res.data);

        } catch (err) {
            console.error(err);
            alert("Error fetching summary");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllSalesmen();
    }, []);

    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">

                        <div className="form-group">
                            <label>Start-date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                        </div>
                        <div className="form-group">
                            <label>End-date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <button onClick={handleFind}
                                className="padd trans-submit-btn"
                            >
                                {loading ? "Loading..." : "Find"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trans-container set-margin">
                <div className="all-table">
                    <div className="all-row header">
                        <div>SalesmanCode</div>
                        <div>Name</div>
                        <div>Qty Sale</div>
                        <div>Net Sale Amt</div>
                        <div>Total Deposit</div>
                        <div>Short/Excess</div>
                    </div>

                    {rows.length === 0 && (
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            No data found
                        </div>
                    )}

                    {rows.map((r, i) => (
                        <div className="all-row6" key={i}>
                            <div>{r.salesmanCode}</div>
                            <div>{r.salesmanName}</div>
                            <div>{r.qtySale}</div>
                            <div>₹{r.netSaleAmount}</div>
                            <div>₹{r.totalDeposit.toFixed(2)}</div>
                            <div>{(r.shortExcess >= 0) &&
                                (<div style={{
                                    color: "green"
                                }}> ₹{r.shortExcess.toFixed(2)}</div>)}

                                {(r.shortExcess < 0) &&
                                    (
                                        <div style={{
                                            color: "red"
                                        }}> ₹{r.shortExcess.toFixed(2)}</div>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ShortExcess