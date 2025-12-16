import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import { useSalesmanModal } from '../../context/SalesmanModalContext';
const S_Sheet = () => {

  const { getSettlement, loading } = useTransaction();
  const { salesmans } = useSalesman();

  const [sheetData, setSheetData] = useState(null);

  const codeRef = useRef(null);
  const dateRef = useRef(null);
  const tripRef = useRef(null);
  const findRef = useRef(null);

  const { openSalesmanModal } = useSalesmanModal();

  const [sheet, setSheet] = useState({
    salesmanCode: "",
    date: "",
    trip: 1,
    schm: ""
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!sheet.salesmanCode || !sheet.trip || !sheet.date) {
  //     toast.error("Fill all fields properly");
  //     return;
  //   }

  //   try {
  //     await getPriceByDate(sheet.code, sheet.date);

  //   } catch (err) {

  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sheet.salesmanCode || !sheet.trip || !sheet.date) {
      toast.error("Fill all fields properly");
      return;
    }

    try {
      const data = await getSettlement({
        salesmanCode: sheet.salesmanCode,
        date: sheet.date,
        trip: Number(sheet.trip) || 1,
        schm: Number(sheet.schm) || 0,
      });

      setSheetData(data); // store settlement details in UI

      setSheet({
        salesmanCode: "",
        date: "",
        trip: 1,
        schm: ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotalA = (sale, ref) => {
    if (!sale || !ref) return;
    return sale - ref;
  }

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


  const matchedSalesman = Array.isArray(salesmans)
    ? salesmans.find((sm) => String(sm.codeNo || sm.code || '').toUpperCase() === String(sheet.salesmanCode || sheetData?.salesmanCode || '').toUpperCase())
    : null;


  return (
    <div className='trans'>
      <div className="trans-container">
        <div className="trans-left">
          <form className="trans-form">
            <div className="salesman-detail">
              <div className="form-group">
                <label>Salesman Code</label>
                <div className="input-with-btn">
                <input
                  type="text"
                  placeholder='Enter Salesman code'
                  value={sheet.salesmanCode || sheetData?.salesmanCode || ""}
                  onChange={(e) => setSheet({ ...sheet, salesmanCode: e.target.value })}
                  onKeyDown={(e) => handleKeyNav(e, "code")}
                  ref={codeRef}
                />
                <button
                  type="button"
                  className="dropdown-btn"
                  onClick={() =>
                    openSalesmanModal((code) =>
                     setSheetData(prev => ({ ...prev, salesmanCode: code }))
                    )
                  }
                >
                  ⌄
                </button>
                </div>
              </div>
              <div className="form-group">
                <label>Salesman Name</label>
                <input
                  readOnly
                  type="text"
                  value={matchedSalesman ? matchedSalesman.name : ""}
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
              <div className="form-group">
                <label>Route No.</label>
                <input
                  readOnly
                  type="number"
                  value={matchedSalesman ? matchedSalesman.routeNo : ""}
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={sheet.date || sheetData?.date || ""}
                  onChange={(e) => setSheet({ ...sheet, date: e.target.value })}
                  onKeyDown={(e) => handleKeyNav(e, "date")}
                  ref={dateRef}
                />
              </div>
              <div className="form-group">
                <label>Trip No.</label>
                <input
                  type="number"
                  value={sheet.trip || sheetData?.trip || ""}
                  onChange={(e) => setSheet({ ...sheet, trip: e.target.value })}
                  ref={tripRef}
                  onKeyDown={(e) => handleKeyNav(e, "trip")}
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
                    readOnly
                    value={sheetData?.totals?.totalSale || ""}
                    type="number"
                    placeholder="Enter Sale Price"
                  />
                </div>
                <div className="form-group">
                  <label>DEP/REF</label>
                  <input
                    readOnly
                    value={sheetData?.cashCreditDetails?.ref || ""}
                    type="number"
                    placeholder="Enter"
                  />
                </div>
                <div className="form-group">
                  <label>TOTAL A</label>
                  <input
                    readOnly
                    value={calculateTotalA(sheetData?.totals?.totalSale, sheetData?.cashCreditDetails?.ref) || ""}
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
                    value={sheetData?.schm || sheet.schm || ""}
                    onChange={(e) => setSheet({ ...sheet, schm: e.target.value })}
                    placeholder="Enter"
                  />
                </div>


                <div className="form-group">
                  <label>TOTAL B</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.schm || ""}
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
                    readOnly
                    type="number"
                    placeholder="Enter"
                    value={
                      sheetData?.cashCreditDetails?.ref ?
                        (sheetData?.totals?.grandTotal - sheetData?.cashCreditDetails?.ref).toFixed(2) : ""}
                  />
                </div>

                <div className="form-group">
                  <label>Net Collection</label>
                  <input
                    readOnly
                    type="number"
                    placeholder="Enter"
                    value={sheetData?.totals?.grandTotal || ""}
                  />
                </div>
                <div className="form-group">
                  <label>Cheq.Desposited</label>
                  <input
                    readOnly
                    type="number"
                    value={(sheetData?.cashCreditDetails?.chequeDeposited) || ""}
                    placeholder="Enter"
                  />
                </div>
              </div>
              <div className="flex">
                <div className="form-group">
                  <label>Cash Short</label>
                  <input
                    readOnly
                    type="number"
                    value={
                      (sheetData?.totals?.shortOrExcess < 0) ?
                        -(sheetData?.totals?.shortOrExcess) : ""}
                    placeholder="Enter"
                  />
                </div>
                <div className="form-group">
                  <label>Short/Excess</label>
                  <input
                    readOnly
                    type="number"
                    className={sheetData?.totals?.shortOrExcess > 0 ? "excess" : "short"}
                    style={{
                      color: sheetData?.totals?.shortOrExcess > 0 ? 'green' :
                        sheetData?.totals?.shortOrExcess < 0 ? 'red' : 'black'
                    }}
                    value={(sheetData?.totals?.shortOrExcess) || ""}
                    placeholder="Enter"
                  />
                </div>
                <div className="form-group">
                  <label>Cash Deposited</label>
                  <input
                    readOnly
                    type="number"
                    value={(sheetData?.cashCreditDetails?.cashDeposited) || ""}
                    placeholder="Enter"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
      <button
        className='trans-submit-btn'
        ref={findRef}
        onClick={handleSubmit}
        onKeyDown={(e) => handleKeyNav(e, "find")}
        disabled={loading}
      >
        {loading ? "Loading..." : "Find"}
      </button>
    </div >
  )
}

export default S_Sheet
