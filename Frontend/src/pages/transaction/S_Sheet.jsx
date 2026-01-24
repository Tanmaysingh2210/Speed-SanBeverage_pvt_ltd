import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import { useSalesmanModal } from '../../context/SalesmanModalContext';
import toast from 'react-hot-toast';
import api from '../../api/api';

const S_Sheet = () => {

  const { getSettlement, loading } = useTransaction();
  const { salesmans } = useSalesman();

  const [sheetData, setSheetData] = useState(null);
  const [discount, setDiscount] = useState("");    // editable schm

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

  const handleSaveDiscount = async () => {
    if (!discount) {
      alert("Enter discount before saving");
      return;
    }

    try {
      await api.post('/transaction/settlement/save-schm', {
        salesmanCode: sheetData.salesmanCode.trim().toUpperCase(),
        date: sheetData.date,
        trip: sheetData.trip,
        schm: Number(discount)
      });

      toast.success("Discount saved successfully");

      // update UI without reload
      setSheetData(prev => ({
        ...prev,
        schm: Number(discount)
      }));

    } catch (err) {
      console.error(err);
      toast.error("Failed to save discount");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sheet.salesmanCode || !sheet.trip || !sheet.date) {
      toast.error("Fill all fields properly");
      return;
    }

    try {
      const data = await getSettlement({
        salesmanCode: sheet.salesmanCode.trim().toUpperCase(),
        date: sheet.date,
        trip: Number(sheet.trip) || 1,
      });

      setSheetData(data); // store settlement details in UI
      setDiscount(data.schm || "");

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

  let totalA = 0;
  let totalB = 0;

  const calculateTotalA = (sale, tax) => {
    if (!sale || !tax) return;
    totalA = sale + tax;
    return sale + tax;
  }

  const calculateTotalB = (credit, ref, priceDisc, schm) => {
    if (!credit || !ref || !priceDisc || !schm) return;
    totalB = credit + ref + priceDisc + schm;
    return credit + ref + priceDisc + schm;
  }

  let shortOrExcess = 0;
  const calculateShortOrExcess = (totalA, cashDeposited, chequeDeposited) => {
    if (!totalA || !cashDeposited || !chequeDeposited) return;
    shortOrExcess = cashDeposited + chequeDeposited - totalA;
    return cashDeposited + chequeDeposited - totalA;
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
                    onChange={(e) => setSheet({ ...sheet, salesmanCode: e.target.value.trim().toUpperCase() })}
                    onKeyDown={(e) => handleKeyNav(e, "code")}
                    ref={codeRef}
                  />
                  <button
                    type="button"
                    className="dropdown-btn"
                    onClick={() =>
                      openSalesmanModal((code) =>
                        setSheet(prev => ({ ...prev, salesmanCode: code.trim().toUpperCase() }))
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
                  value={matchedSalesman ? matchedSalesman.name.trim().toUpperCase() : ""}
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

          <div className="item-inputs">
            <div className="gap1">
              <div className="flex">
                <div className="form-group">
                  <label>Sale</label>
                  <input
                    readOnly
                    value={sheetData?.totals?.totalSale || 0}
                    type="number"
                    placeholder="Enter Sale Price"
                  />
                </div>
                <div className="form-group">
                  <label>TAX</label>
                  <input
                    readOnly
                    value={sheetData?.totals?.totalTax || 0}
                    type="number"
                    placeholder="Enter"
                  />
                </div>
                <div className="form-group">
                  <label>TOTAL A</label>
                  <input
                    readOnly
                    value={calculateTotalA(sheetData?.totals?.totalSale, sheetData?.totals?.totalTax) || 0}
                    type="number"
                  />
                </div>
              </div>
              <div className="flex">
                <div className="form-group">
                  <label>CREDIT SALE</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.cashCreditDetails?.creditSale || 0}
                  />
                </div>
                <div className="form-group">
                  <label>PRICE DISCOUNT</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.totals?.totalDiscount || 0}
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
              </div>
              <div className="flex">
                <div className="form-group">
                  <label>SMP,DSC,INCM,SCME</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Enter discount"
                  />
                </div>
                <div className="form-group">
                  <label>TOTAL B</label>
                  <input
                    readOnly
                    type="number"
                    value={calculateTotalB(sheetData?.cashCreditDetails?.creditSale || 0, sheetData?.cashCreditDetails?.ref || 0, sheetData?.totals?.totalDiscount || 0, sheetData?.schm || 0) || 0}
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
                    value={totalA - totalB}
                  />
                </div>

                <div className="form-group">
                  <label>Net Collection</label>
                  <input
                    readOnly
                    type="number"
                    // value={sheetData?.totals?.grandTotal || 0}
                    value={totalA + sheetData?.cashCreditDetails?.creditSale || 0}
                  />
                </div>
                <div className="form-group">
                  <label>Cheq.Desposited</label>
                  <input
                    readOnly
                    type="number"
                    value={(sheetData?.cashCreditDetails?.chequeDeposited) || 0}
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
                        -(sheetData?.totals?.shortOrExcess) : 0}
                  />
                </div>
                <div className="form-group">
                  <label>Short/Excess</label>
                  <input
                    readOnly
                    type="number"
                    className={calculateShortOrExcess(totalA || 0, sheetData?.cashCreditDetails?.cashDeposited || 0, sheetData?.cashCreditDetails?.chequeDeposited || 0) > 0 ? "excess" : "short"}
                    style={{
                      color: calculateShortOrExcess(totalA || 0, sheetData?.cashCreditDetails?.cashDeposited || 0, sheetData?.cashCreditDetails?.chequeDeposited || 0) > 0 ? 'green' :
                        calculateShortOrExcess(totalA || 0, sheetData?.cashCreditDetails?.cashDeposited || 0, sheetData?.cashCreditDetails?.chequeDeposited || 0) < 0 ? 'red' : 'black'
                    }}
                    // value={(sheetData?.totals?.shortOrExcess) || 0}
                    value={calculateShortOrExcess(totalA || 0, sheetData?.cashCreditDetails?.cashDeposited || 0, sheetData?.cashCreditDetails?.chequeDeposited || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Cash Deposited</label>
                  <input
                    readOnly
                    type="number"
                    value={(sheetData?.cashCreditDetails?.cashDeposited) || 0}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex">
        <button
          className='trans-submit-btn'
          ref={findRef}
          onClick={handleSubmit}
          onKeyDown={(e) => handleKeyNav(e, "find")}
          disabled={loading}
        >
          {loading ? "Loading..." : "Find"}
        </button>
        {sheetData && (
          <button
            className="trans-submit-btn"
            onClick={handleSaveDiscount}
          >
            Save Discount
          </button>
        )}
      </div>
    </div >
  )
}

export default S_Sheet
