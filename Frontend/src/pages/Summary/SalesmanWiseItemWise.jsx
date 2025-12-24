import React from 'react'
import api from "../../api/api.js";
import { useState, useEffect, useRef } from 'react';
import { useSalesmanModal } from '../../context/SalesmanModalContext.jsx';
import "../transaction/transaction.css";
import { useSalesman } from '../../context/SalesmanContext.jsx';

const SalesmanWiseItemWise = () => {
  const [salesmanCode, setSalesmanCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openSalesmanModal } = useSalesmanModal();
  const { getAllSalesmen } = useSalesman();
  const startRef = useRef(null);
  const endRef = useRef(null);
  const findRef = useRef(null);
  const saleCodeRef = useRef(null);


  useEffect(() => {
    startRef.current?.focus();
  }, []);
  const handleKeyNav = (e, currentField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "Enter" && currentField === "find") {
        findRef.current?.click();
        return;
      }
      switch (currentField) {
        case "saleCode":
          startRef.current?.focus();
          break;
        case "startDate":
          endRef.current?.focus();
          break;
        case "endDate":
          if (e.key === "Enter") {
            findRef.current?.click();
          } else {
            findRef.current?.focus();
          }
          break;
        default:
          break;
      }
    }
    else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      switch (currentField) {
        case "find":
          endRef.current?.focus();
          break;
        case "endDate":
          startRef.current?.focus();
          break;
        case "startDate":
          saleCodeRef.current?.focus();
          break;
        default:
          break;
      }
    }
  }

  const handleFind = async () => {
    if (!salesmanCode || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/summary/salesman-wise-item-wise?salesmanCode=${salesmanCode}&startDate=${startDate}&endDate=${endDate}`
      );

      console.log("SUMMARY DATA:", res.data); // 👈 must see this
      setRows(res.data);

    } catch (err) {
      console.error(err);
      alert("Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSalesmen();
  }, []);

  return (
    <div className='trans'>
      <div className="trans-container">
        <div className="trans-up">
          <div className="flex">
            <div className="form-group">
              <label>Salesman Code</label>
              <div className="input-with-btn">
                <input
                onKeyDown={(e) => handleKeyNav(e, "saleCode")}
                ref={saleCodeRef}
                  type="text"
                  value={salesmanCode}
                  onChange={(e) => setSalesmanCode(e.target.value)}
                />
                <button
                  type="button"
                  className="dropdown-btn"
                  onClick={() =>
                    openSalesmanModal((code) =>
                      setSalesmanCode(code)
                    )
                  }
                >
                  ⌄
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Start-date</label>
              <input
                onKeyDown={(e) => handleKeyNav(e, "startDate")}
                ref={startRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

            </div>
            <div className="form-group">
              <label>End-date</label>
              <input
                onKeyDown={(e) => handleKeyNav(e, "endDate")}
                ref={endRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button onClick={handleFind}
                ref={findRef}
                onKeyDown={(e) => handleKeyNav(e, "find")}
                className="padd trans-submit-btn"
              >
                {loading ? "Loading..." : "Find"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="trans-container set-margin">
        <div className="all-table">
          <div className="all-row header">
            <div>ItemCode</div>
            <div>ItemName</div>
            <div>Qty Sale</div>
            <div>Net Price</div>
          </div>

          {rows.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              No data found
            </div>
          )}

          {rows.map((r, i) => (
            <div className="all-row4" key={i}>
              <div>{r.itemCode}</div>
              <div>{r.itemName}</div>
              <div>{r.qtySale}</div>
              <div>₹{r.netPrice}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default SalesmanWiseItemWise