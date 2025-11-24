import React, { useState, useRef, useEffect } from 'react'  // Fix: useState, useEffect (lowercase)
import { usePrice } from '../../context/PricesContext'
import { useSKU } from '../../context/SKUContext'
import './Prices.css'

const BrowsePrice = () => {
  const { prices, getAllPrices, updatePrice, deletePrice, loading } = usePrice();
  const { items, getAllItems } = useSKU();
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editPrice, setEditPrice] = useState({
    code: "",
    name: "",
    basePrice: "",
    perDisc: "",
    perTax: "",
    date: "",
    status: "Active"
  })

  useEffect(() => {
    getAllItems();
    getAllPrices();
  }, []);

  useEffect(() => {
    if (editPrice.code) {
      const found = items.find(
        (item) => item.code.toUpperCase() === editPrice.code.toUpperCase()
      );
      if (found) {
        setEditPrice((prev) => ({
          ...prev,
          name: found.name,
        }));
      }
    }
  }, [editPrice.code, items]);

  const modalRef = useRef(null)
  const codeRef = useRef(null)
  const baseRef = useRef(null)
  const taxRef = useRef(null)
  const dateRef = useRef(null)
  const discRef = useRef(null);
  const statusRef = useRef(null)
  const saveRef = useRef(null)

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this price?")) {
      await deletePrice(id);
    }
  };

  // Edit handler
  const handleEdit = (price) => {
    setEditId(price._id);
    setEditPrice({
      code: price.itemCode || "",
      name: price.name || "",
      basePrice: price.basePrice || "",
      perDisc: price.perDisc || "",
      perTax: price.perTax || "",
      date: price.date ? price.date.split("T")[0] : "",
      status: price.status || "Active"
    });
    setShowModal(true);
  }

  // Save handler (for modal)
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate item exists
    const found = items.find(
      (item) => item.code.toUpperCase() === editPrice.code.toUpperCase()
    );

    if (!found) {
      alert("❌ Invalid item code — item not found!");
      return;
    }

    if (!editPrice.basePrice || !editPrice.perTax || !editPrice.date) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    const payload = {
      code: editPrice.code,
      name: editPrice.name,
      basePrice: Number(editPrice.basePrice),
      perTax: Number(editPrice.perTax),
      perDisc: Number(editPrice.perDisc),
      date: editPrice.date,
      status: editPrice.status,
    };

    console.log('Update price payload:', payload);

    try {
      if (editId) {
        await updatePrice(editId, payload);
      }

      setShowModal(false);
      setEditId(null);
      setEditPrice({
        code: "",
        name: "",
        basePrice: "",
        perDisc: "",
        perTax: "",
        date: "",
        status: "Active",
      });
    } catch (err) {
      console.error(err?.response?.data?.message || "Error updating price");
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);



  const FormatDate = (isodate) => {
    if (!isodate) return ""
    const date = new Date(isodate);
    const day = String(date.getDate()).padStart(2, "0");
    const Month = String(date.getMonth() + 1).padStart(2, "0");
    const Year = date.getFullYear();
    return `${day}-${Month}-${Year}`
  }


  const calculateNetRate = (basePrice, perTax, perDisc) => {
    if (!basePrice || !perTax) return '';
    let taxablePrice = (parseFloat(basePrice) - (parseFloat(basePrice) * parseFloat(perDisc) / 100)).toFixed(2);
    return (parseFloat(taxablePrice) + (parseFloat(taxablePrice) * parseFloat(perTax) / 100)).toFixed(2);
  };

  const safeString = (v) => {
    return (v == null || v == undefined) ? '' : String(v)
  }

  const getActivePrice = (selectedDate) => {
    if (!selectedDate) return prices;

    const latestPrices = {}

    prices.forEach((p) => {
      const priceDate = p?.date?.split("T")[0]

      if (priceDate <= selectedDate) {
        const code = p.itemCode;

        if (!latestPrices[code] || priceDate > latestPrices[code].date.split("T")[0]) {
          latestPrices[code] = p
        }
      }
    })
    return Object.values(latestPrices)
  }

  const filtered = Array.isArray(prices) ?
    getActivePrice(selectedDate).filter((p) => {
      const matchesSearch = safeString(p?.name).toLowerCase().includes(safeString(search).toLowerCase())
      return matchesSearch;
    })

    : []

  const matchedItem = Array.isArray(items) ? items.find(
    (sm) => String(sm.code || '').toUpperCase() === String(editPrice.code || '').toUpperCase()
  ) : null;


  const handleKeyNav = (e, currentField) => {
    if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();

      if (e.key === "Enter" && currentField === "save") {
        saveRef.current?.click();
        return;
      }

      switch (currentField) {
        case "basePrice":
          discRef.current?.focus();
          break;
        case "disc":
          taxRef.current?.focus();
          break;
        case "perTax":
          dateRef.current?.focus();
          break;
        case "date":
          if (e.key === "Enter") {
            saveRef.current?.click();
          } else {
            saveRef.current?.focus();
          }
          break;
        default:
          break;
      }
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      switch (currentField) {
        case "disc":
          baseRef.current?.focus();
          break;
        case "perTax":
          discRef.current?.focus();
          break;
        case "date":
          taxRef.current?.focus();
          break;
        case "save":
          dateRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };


  return (
    <div className="price-container">

      <div className="price-header">
        <input
          type="text"
          placeholder='🔍 Search items'
          value={search}
          onChange={(e) => { setSearch(e.target.value) }}
          className="price-search"
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value) }}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          />
          <button
            onClick={() => setSelectedDate("")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Selected Date Info */}
      {selectedDate && (
        <p style={{ marginBottom: '15px', color: '#666' }}>
          Showing prices active on: <strong>{FormatDate(selectedDate + "T00:00:00")}</strong>
        </p>
      )}

      {/* Table */}
      <div className="price-table">
        {/* Header Row */}
        <div className="price-row header">
          <div>SL.NO.</div>
          <div>CODE</div>
          <div>NAME</div>
          <div>BASE PRICE</div>
          <div>% DISC</div>
          <div>% TAX</div>
          <div>NET RATE</div>
          <div>DATE</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>

        {/* No Data Message */}
        {filtered.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            backgroundColor: 'white'
          }}>
            No items found
          </div>
        )}

        {/* Data Rows */}
        {filtered.map((p, i) => {
          const rowItem = Array.isArray(items) ?
            items.find((it) =>
              String(it.code || "").toUpperCase() === String(p.itemCode || "").toUpperCase()
            ) : null;

          return (
            <div key={p?._id || i} className="price-row">
              <div>{i + 1}</div>
              <div>{p?.itemCode?.toUpperCase() || ''}</div>
              <div>{rowItem?.name?.toUpperCase() || ''}</div>
              <div>₹{p?.basePrice || ''}</div>
              <div>{p?.perDisc || ''}%</div>
              <div>{p?.perTax || ''}%</div>
              <div>₹{calculateNetRate(p?.basePrice, p?.perTax, p?.perDisc)}</div>
              <div>{FormatDate(p?.date) || ""}</div>
              <div className="status">
                <span className={`status-badge ${p?.status === 'Active' ? 'active' : 'inactive'}`}>
                  {p?.status || ''}
                </span>
              </div>
              <div className="actions">
                <span className="edit" onClick={() => handleEdit(p)}>
                  Edit
                </span>
                {" | "}
                <span className="delete" onClick={() => handleDelete(p._id)}>
                  Delete
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <h2>Edit Price</h2>

            <div className="form-group">
              <label>Item Code</label>
              <input
                ref={codeRef}
                type="text"
                value={editPrice.code}
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>

            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                value={matchedItem?.name || ""}
                readOnly
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>

            <div className="form-group">
              <label>Base Price</label>
              <input
                ref={baseRef}
                type="number"
                value={editPrice.basePrice}
                onChange={(e) => setEditPrice({ ...editPrice, basePrice: e.target.value })}
                onKeyDown={(e) => handleKeyNav(e, "basePrice")}
              />
            </div>

            <div className="form-group">
              <label>% Disc</label>
              <input
                ref={discRef}
                onKeyDown={(e) => handleKeyNav(e, "disc")}
                type="number"
                value={editPrice.perDisc}
                onChange={(e) => setEditPrice({ ...editPrice, perDisc: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>% Tax</label>
              <input
                ref={taxRef}
                onKeyDown={(e) => handleKeyNav(e, "perTax")}
                type="number"
                value={editPrice.perTax}
                onChange={(e) => setEditPrice({ ...editPrice, perTax: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                ref={dateRef}
                onKeyDown={(e) => handleKeyNav(e, "date")}
                type="date"
                value={editPrice.date}
                onChange={(e) => setEditPrice({ ...editPrice, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Net Rate</label>
              <input
                type="text"
                value={calculateNetRate(editPrice.basePrice, editPrice.perTax, editPrice.perDisc)}
                readOnly
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                ref={statusRef}
                value={editPrice.status}
                onChange={(e) => setEditPrice({ ...editPrice, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button
                ref={saveRef}
                onKeyDown={(e) => handleKeyNav(e, "save")}

                className="submit-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowsePrice