import React from 'react';
import "../transaction/transaction.css";

const PurchaseEntry = () => {


    return (
        <div className="trans">
            <div className="trans-container">
                <div className="trans-left">
                    <form className="trans-form">
                        <div className="salesman-detail">
                            <div className="form-group">
                                <label>Party</label>
                                <input
                                    type="text"
                                    placeholder="enter party no."
                                />
                            </div>

                            <div className="form-group">
                                <label>Slno.</label>
                                <input
                                    type="number"
                                    placeholder="enter slno."
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                />
                            </div>

                            <div className="form-group">
                                <label>GRA</label>
                                <input
                                    type="number"
                                    placeholder="Enter GRA no."
                                />
                            </div>
                        </div>
                    </form>

                </div>
                <div className="item-inputs">
                    <div></div>
                    <div className="flex">
                        <div className="form-group">
                            <label>Sale</label>
                            <input
                                type="number"
                                placeholder="Enter Sale Price"
                            />
                        </div>

                    </div>

                </div>


            </div>

        </div>
    )
}

export default PurchaseEntry;