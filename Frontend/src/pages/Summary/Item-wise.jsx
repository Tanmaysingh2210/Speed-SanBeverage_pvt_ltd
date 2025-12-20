import React from 'react'
import "../transaction/transaction.css"

const ItemWiseSummary = () => {
    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">
                        <div className="form-group">
                            <label>Start-date</label>
                            <input

                                type="date"



                            />
                        </div>
                        <div className="form-group">
                            <label>End-date</label>
                            <input

                                type="date"



                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="padd trans-submit-btn"
                            >
                                Find
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trans-container set-margin">
                <div className="all-table">
                    <div className="all-row header">
                        <div>CODE</div>
                        <div>NAME</div>
                        <div>QUANTITY</div>
                        <div>AMOUNT</div>
                        
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ItemWiseSummary
