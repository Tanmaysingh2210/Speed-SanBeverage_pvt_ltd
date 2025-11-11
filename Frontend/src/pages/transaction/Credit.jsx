import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTransaction } from '../../context/TransactionContext';
import { useSKU } from '../../context/SKUContext';
import { useSalesman } from '../../context/SalesmanContext';
import "./transaction.css";

const Credit = () => {



    
    return (
        <div className="trans">
            <div className="trans-container">
                <div className="trans-left">
                    <form className="trans-form">
                        <div className="form-group">
                            <lable>Cash/Credit</lable>
                            <select>
                                <option>cash</option>
                                <option>credit</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                            />
                        </div>
                        <div className="form-group">
                            <label>Salesman Code</label>
                            <input
                                type="text"
                                placeholder="Enter Salesman Code"
                            />
                        </div>
                        <div className="form-group">
                            <label>Salesman Name</label>
                            <input
                                readOnly
                                type="text"
                                style={{ backgroundColor: "#f5f5f5" }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Trip</label>
                            <input
                                type="number"
                                placeholder="Enter Trip no."
                            />
                        </div>
                    </form>

                    <div className="item-inputs">

                        <div className="form-group">
                            <lable>Value</lable>
                            <input
                                type="number"
                                placeholder="Enter Value"
                            />
                        </div>
                        <div className="form-group">
                            <label>Tax</label>
                            <input
                                type="number"
                                placeholder="% Tax"
                            />
                        </div>
                        <div className="form-group">
                            <label>NetValue</label>
                            <input
                                readOnly
                                type="number"
                                style={{ backgroundColor: "#f5f5f5" }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Remark</label>
                             <input 
                                 type="text"
                             />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Credit;