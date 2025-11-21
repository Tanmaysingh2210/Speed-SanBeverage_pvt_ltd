import React, { useRef } from 'react'
import "./transaction.css";

const AllTransaction = () => {
    const dateRef = useRef(null);
    const codeRef = useRef(null);
    const tripRef = useRef(null);
    const findRef = useRef(null);


    const handleKeyNav = (e, currentField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "Enter" && currentField === "find") {
        findRef.current?.click();
        return;
      }
      switch (currentField) {
        case "code":
          dateRef.current?.focus();
          break;
        case "date":
          tripRef.current?.focus();
          break;
        case "trip":
          if (e.key === "Enter") {
            findRef.current?.click();
          } else {
            findRef.current?.focus();
          }
          break;
        default:
          break;
      }
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      switch (currentField) {
        case "date":
          codeRef.current?.focus();
          break;
        case "trip":
          dateRef.current?.focus();
          break;
        case "find":
          tripRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">
                        <div className="form-group">
                            <label>Transaction Type</label>
                            <select>
                                <option value="all">All</option>
                                <option value="loadout">Load Out</option>
                                <option value="loadin">Load In</option>
                                <option value="cash-credit">Cash/Credit</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Salesman Code</label>
                            <input
                                type="text"
                                ref={codeRef}
                                onKeyDown={(e)=>handleKeyNav(e, "code")}
                                placeholder='Enter Salesman code'
                            />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                ref={dateRef}
                                onKeyDown={(e)=>handleKeyNav(e, "date")}

                                type="date"
                            />
                        </div>
                        <div className="form-group">
                            <label>Trip</label>
                            <input
                                ref={tripRef}
                                onKeyDown={(e)=>handleKeyNav(e, "trip")}

                                type="number"
                                placeholder='Enter trip no.'
                            />
                        </div>
                        <div className="form-group">
                            <button 
                            className='padd trans-submit-btn' 
                                onKeyDown={(e)=>handleKeyNav(e, "find")}

                            ref={findRef}
                            >
                                Find
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trans-container set-margin">
                <div className="table">
                    
                </div>
            </div>

        </div>
    )
}

export default AllTransaction
