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

                    <div className="item-inputs ">

                        <div className="flex name-address">
                        
                            <div className="form-group name-address-box">
                                <label>Name & Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name and Address"
                                />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="form-group">
                                <label>Vehicle no.</label>
                                <input
                                    type="text"
                                    placeholder="Enter vehicle no."
                                />
                            </div>

                            <div className="form-group">
                                <label>VNO DT.</label>
                                <input
                                    type="date"
                                />
                            </div>

                            <div className="form-group">
                                <label>VNO.</label>
                                <input
                                    type="text"
                                    placeholder="Enter "
                                />
                            </div>
                        </div>

                        <div className="flex">
                            <div className="form-group">
                                <label>BILL</label>
                                <input
                                    type="text"
                                    placeholder="Enter "
                                />
                            </div>

                            <div className="form-group">
                                <label>ERC</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>

                            <div className="form-group">
                                <label>FRC</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>
                        </div>
                        

                    </div>

                </div>



                <div className="trans-bottom">
                     <div className="flex">
                            <div className="form-group">
                                <label>Value</label>
                                <input
                                    type="number"
                                    placeholder="Enter "
                                />
                            </div>

                            <div className="form-group">
                                <label>DISC</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>

                            <div className="form-group">
                                <label>TOTAL</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>
                        </div>
                        
                        <div className="flex">
                            <div className="form-group">
                                <label>%VAT</label>
                                <input
                                    type="number"
                                    placeholder="Enter "
                                />
                            </div>

                            <div className="form-group">
                                <label>VAT</label>
                                <input
                                    type="number"
                                    placeholder="Enter"
                                />
                            </div>

                            <div className="form-group">
                                <label>NETAMT</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>
                        </div>
                        
                     <div className="flex">
                            <div className="form-group purchase-agst">
                                <label>PURCHASE AGST</label>
                                <input
                                    type="number"
                                    placeholder="Enter "
                                />
                            </div>

                            

                            <div className="form-group form-issue">
                                <label>Form Issue</label>
                                <input
                                    type="text"
                                    placeholder="Enter"
                                />
                            </div>
                        </div>
                        


                </div>

            </div>

        </div>
    )
}

export default PurchaseEntry;