import React from 'react'
import { useState, useEffect, useRef } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import { useSalesmanModal } from '../../context/SalesmanModalContext';
import toast from 'react-hot-toast';
import api from '../../api/api';
import { useSKU } from '../../context/SKUContext';
import {ItemBreakdownModal} from "./ItemBreakdownModal";

const S_Sheet = () => {
  const { getSettlement, loading } = useTransaction();
  const { salesmans } = useSalesman();

  const [sheetData, setSheetData] = useState(null);
  const [discount, setDiscount] = useState("");    // editable schm
  const { items } = useSKU();

  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


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
      console.error(err?.data.message);
      toast.error("Failed to save discount");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sheet.salesmanCode || !sheet.date) {
      toast.error("Fill all fields properly");
      return;
    }

    try {
      const data = await getSettlement({
        salesmanCode: sheet.salesmanCode.trim().toUpperCase(),
        date: sheet.date,
        trip: Number(sheet.trip) || 1
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

  const calculateTotalA = (sale, ref) => {
    if (!sale || !ref) return;
    totalA = sale - ref;
    return totalA;
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
                  <label>NET SALE</label>
                  <input
                    readOnly
                    value={sheetData?.totals?.NetSale || 0}
                    type="number"
                    placeholder="Enter Sale Price"
                  />
                </div>
                <div className="form-group">
                  <label>DEP/REF</label>
                  <input
                    readOnly
                    value={sheetData?.cashCreditDetails?.ref || 0}
                    type="number"
                    placeholder="Enter"
                  />
                </div>
                <div className="form-group">
                  <label>TOTAL A</label>
                  <input
                    readOnly
                    value={calculateTotalA(sheetData?.totals?.NetSale, sheetData?.cashCreditDetails?.ref) || 0}
                    type="number"
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
                  <label>REFUNDS</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.totals?.totalRefund || 0}
                  />
                </div>
                <div className="form-group">
                  <label>CREDIT SALE</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.cashCreditDetails?.creditSale || 0}
                  />
                </div>
                {/* <div className="form-group">
                  <label>PRICE DISCOUNT</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.totals?.totalDiscount || 0}
                  />
                </div> */}
                {/* <div className="form-group">
                  <label>TOTAL B</label>
                  <input
                    readOnly
                    type="number"
                    value={calculateTotalB(sheetData?.cashCreditDetails?.creditSale || 0, sheetData?.cashCreditDetails?.ref || 0, sheetData?.totals?.totalDiscount || 0, sheetData?.schm || 0) || 0}
                  />
                </div> */}
              </div>
            </div>

            <div className="gap2">
              <div className="flex">
                <div className="form-group">
                  <label>Cash Sale</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.totals?.NetSale - discount}
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
                  <label>Net Collection</label>
                  <input
                    readOnly
                    type="number"
                    value={sheetData?.totals?.totalDeposited || 0}
                  />
                </div>
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
                    className={sheetData?.totals?.shortOrExcess > 0 ? "excess" : "short"}
                    style={{
                      color: sheetData?.totals?.shortOrExcess > 0 ? 'green' :
                        sheetData?.totals?.shortOrExcess < 0 ? 'red' : 'black'
                    }}
                    value={sheetData?.totals?.shortOrExcess || 0}
                  />
                </div>
              </div>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setSelectedItems(sheetData.items);
                  setShowItemModal(true);
                }}
              >
                View Item Breakdown
              </button>
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
      <ItemBreakdownModal
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        items={selectedItems}
        skuItems={items}   // from SKU context
      />
    </div >
  )
}

export default S_Sheet;
