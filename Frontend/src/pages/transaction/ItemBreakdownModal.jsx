import React, { useState, useRef, useEffect } from "react";

export const ItemBreakdownModal = ({ open, onClose, items, skuItems }) => {
    if (!open) return null;
    const getItemName = (code) =>
        skuItems.find(
            i => i.code?.toUpperCase() === code?.toUpperCase()
        )?.name || "—";

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-header">
                    <h3>Item-wise Settlement</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <table className="modal-table">
                    <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Load Out Qty</th>
                            <th>Load In Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((it, idx) => (
                            <tr key={idx}>
                                <td>{it.itemCode}</td>
                                <td>{getItemName(it.itemCode)}</td>
                                <td>{it.loadedQty}</td>
                                <td>{it.returnedQty}</td>
                                <td>₹{it.finalPrice}</td>
                                <td>₹{it.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
