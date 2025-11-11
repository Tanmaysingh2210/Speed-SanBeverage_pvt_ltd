import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./transaction.css";

const S_Sheet = () => {


  const codeRef = useRef(null);
  const dateRef = useRef(null);
  const tripRef = useRef(null);


  return (
    <div className='trans'>
      <div className="trans-container">
        <div className="trans-left">
          <form className="trans-form">
            <div className="salesman-detail">
              <div className="form-group">
                <label>Salesman Code</label>
                <input
                  type="text"
                  placeholder='Enter Salesman code'
                  ref={codeRef}
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
                <label>Route No.</label>
                <input
                  readOnly
                  type="number"
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  ref={dateRef}
                />
              </div>
              <div className="form-group">
                <label>Trip No.</label>
                <input
                  type="number"
                  ref={tripRef}
                  placeholder='Enter trip no.'
                />
              </div>
            </div>
          </form>
        
        <div className="item-inputs gap3">
            <div className="gap1">
            <div className="flex">
              <div className="form-group">
                <label>Sale</label>
                <input 
                   type="number"
                   placeholder="Enter Sale Price"
                />
              </div>
              <div className="form-group">
                <label>DEP/REF</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
               <div className="form-group">
                <label>TOTAL A</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
            </div>
            <div className="flex">
               <div className="form-group">
                <label>SMP,DSC,INCM,SCME</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>

              <div className="form-group">
                <label>OTHERS</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>


              <div className="form-group">
                <label>TOTAL B</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
            </div>
        </div>  

          <div className="gap2">
            <div className="flex">
             <div className="form-group">
                <label>Cash Sale</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
              
              <div className="form-group">
                <label>Net Collection</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
              <div className="form-group">
                <label>Cheq.Desposited</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
            </div> 
            <div className="flex">
              <div className="form-group">
                <label>Cash Short</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
              <div className="form-group">
                <label>Short/Excess</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>
              <div className="form-group">
                <label>Cash Deposited</label>
                <input 
                   type="number"
                   placeholder="Enter"
                />
              </div>

            </div>
          </div>

          </div>
        </div>
      </div>
    </div >
  )
}

export default S_Sheet
