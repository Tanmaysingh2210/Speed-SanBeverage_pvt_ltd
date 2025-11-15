import React from 'react';
import "../transaction/transaction.css";

const PurchaseEntry = ()=>{


    return(
        <div className="trans">
            <div className="trans-Container">
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
                        </div>
                    </form>

                </div>



            </div>
        
        </div>
    )
}

export default PurchaseEntry;