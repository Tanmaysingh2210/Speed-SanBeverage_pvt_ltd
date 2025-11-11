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
        </div>
      </div>
    </div >
  )
}

export default S_Sheet
