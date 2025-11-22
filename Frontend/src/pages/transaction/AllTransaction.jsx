import React, { useRef, useState } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import toast from 'react-hot-toast';

const AllTransaction = () => {

  const { loadout, getLoadout, updateLoadout, deleteLoadout, loadin, getLoadIn, updateLoadIn, deleteLoadin, cashCredit, getCash_credit, updateCash_credit, deleteCash_credit, loading } = useTransaction();


  const [find, setFind] = useState({
    type: "",
    salesmanCode: "",
    date: "",
    trip: ""
  });


  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Load Out',
      salesmanCode: 'SM001',
      salesmanName: 'John Doe',
      routeNo: 'R-101',
      date: '2025-11-20',
      trip: '1',
      items: [
        { code: 'P200', qty: 10 }
      ]
    },
    {
      id: 2,
      type: 'Load In',
      salesmanCode: 'SM001',
      salesmanName: 'John Doe',
      routeNo: 'R-101',
      date: '2025-11-20',
      trip: '1',
      items: [
        { code: 'ITEM001', filled: 8, burst: 2 }
      ]
    },
    {
      id: 3,
      type: 'Cash/Credit',
      salesmanCode: 'SM002',
      salesmanName: 'Jane Smith',
      routeNo: 'R-102',
      date: '2025-11-19',
      trip: '2',
      cashCredit: 'cash',
      depRef: 400,
      value: 5000,
      tax: 5,
      netValue: 4750,
      cashDeposited: 4750,
      chequeDeposited: 0,
      remark: 'Daily collection'
    },
    {
      id: 4,
      type: 'Load Out',
      salesmanCode: 'SM003',
      salesmanName: 'Mike Johnson',
      routeNo: 'R-103',
      date: '2025-11-21',
      trip: '1',
      items: [
        { code: 'ITEM002', qty: 15 },
        { code: 'ITEM003', qty: 8 }
      ]
    }
  ]);

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

  const FormatDate = (isodate) => {
    if (!isodate) return ""
    const date = new Date(isodate);
    const day = String(date.getDate()).padStart(2, "0");
    const Month = String(date.getMonth() + 1).padStart(2, "0");
    const Year = date.getFullYear();
    return `${day}-${Month}-${Year}`
  }


  const handleFind = async (e) => {
    e.preventDefault();
    if (!find.date || !find.type || !find.trip || !find.salesmanCode) {
      toast.error("Fill all fields");
      return;
    }

    const payload = {
      salesmanCode: find.salesmanCode,
      date: find.date,
      trip: find.trip
    };

    if (find.type === "all") {
      try {
        const loadoutData = await getLoadout(payload);
        const loadinData = await getLoadIn(payload);
        const cashCreditData = await getCash_credit(loadout);

        const newTransactions = [];

        if(loadoutData) {
          newTransactions.push({
            ...loadoutData,
            type: "Load Out"
          });
        }

        if(loadinData){
          newTransactions.push({
            ...loadinData,
            type: "Load In"
          });
        }

        if(cashCreditData){
          newTransactions.push({
            ...cashCreditData,
            type: "Cash/Credit"
          });
        }

        setTransactions([...transactions, ...newTransactions]);
      } catch (error) {
        console.error("Error fetching data");
      }
    }


  }





  const renderDetails = (transaction) => {
    if (transaction.type === 'Load Out' || transaction.type === 'Load In') {
      return (
        <div style={{ fontSize: '14px' }}>
          {transaction.items.map((item, idx) => (
            <div key={idx} style={{ color: '#666', marginBottom: '4px' }}>
              {item.code}: {item.name}
              {transaction.type === 'Load Out' ? ` (Qty: ${item.qty})` : ` (F: ${item.filled}, B: ${item.burst})`}
            </div>
          ))}
        </div>
      );
    } else if (transaction.type === 'Cash/Credit') {
      return (
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div>{transaction.cashCredit.toUpperCase()}</div>
          <div>Value: ₹{transaction.value}</div>
          <div>Net: ₹{transaction.netValue}</div>
        </div>
      );
    }
  };



  return (
    <div className='trans'>
      <div className="trans-container">
        <div className="trans-up">
          <div className="flex">
            <div className="form-group">
              <label>Transaction Type</label>
              <select value={find.type}
                onChange={(e) => setFind({ ...find, type: e.target.value })}
              >
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
                value={find.salesmanCode}
                onChange={(e) => setFind({ ...find, salesmanCode: e.target.value })}
                ref={codeRef}
                onKeyDown={(e) => handleKeyNav(e, "code")}
                placeholder='Enter Salesman code'
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                ref={dateRef}
                value={find.date}
                onChange={(e) => setFind({ ...find, date: e.target.value })}
                onKeyDown={(e) => handleKeyNav(e, "date")}
                type="date"
              />
            </div>
            <div className="form-group">
              <label>Trip</label>
              <input
                ref={tripRef}
                onKeyDown={(e) => handleKeyNav(e, "trip")}
                value={find.trip}
                onChange={(e) => setFind({ ...find, trip: e.target.value })}
                type="number"
                placeholder='Enter trip no.'
              />
            </div>
            <div className="form-group">
              <button
                className='padd trans-submit-btn'
                onKeyDown={(e) => handleKeyNav(e, "find")}
                onClick={handleFind}
                ref={findRef}
                disabled={loading}
              >
                {loading ? "Wait..." : "Find"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="trans-container set-margin">
        <div className="all-table">
          <div className="all-row header">
            <div>TYPE</div>
            <div>SALESMAN</div>
            <div>NAME</div>
            <div>DATE</div>
            <div>TRIP</div>
            <div>DETAILS</div>
            <div>ACTIONS</div>
          </div>

          {transactions.length === 0 && (
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
          {transactions.map((p, i) => {
            // const rowItem = Array.isArray(items) ?
            //   items.find((it) =>
            //     String(it.code || "").toUpperCase() === String(p.itemCode || "").toUpperCase()
            //   ) : null;

            return (
              <div key={p?._id || i} className="all-row">
                <div>{p?.type}</div>
                <div>{p?.salesmanCode?.toUpperCase() || ''}</div>
                <div>{p?.salesmanName?.toUpperCase() || ''} </div>
                {/* <div>₹{calculateNetRate(p?.basePrice, p?.perTax, p?.perDisc)}</div> */}
                <div>{FormatDate(p?.date) || ""}</div>
                <div>{p?.trip} </div>
                <div>{renderDetails(p)} </div>
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
      </div>
    </div >

  )
};


const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 32px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
  },
  tab: {
    padding: '8px 16px',
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabActive: {
    padding: '8px 16px',
    color: '#2563eb',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid #2563eb',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 32px',
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    padding: '24px',
    marginBottom: '24px',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  filterTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  clearButton: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#2563eb',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  resultsCount: {
    marginBottom: '16px',
    fontSize: '14px',
    color: '#6b7280',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto auto 1.5fr auto',
    gap: '16px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 24px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto auto 1.5fr auto',
    gap: '16px',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'start',
    transition: 'background-color 0.2s',
  },
  badge: {
    display: 'inline-flex',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '9999px',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  badgeGreen: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgePurple: {
    backgroundColor: '#e9d5ff',
    color: '#6b21a8',
  },
  salesmanCode: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  salesmanName: {
    fontSize: '14px',
    color: '#6b7280',
  },
  cellText: {
    fontSize: '14px',
    color: '#111827',
  },
  actionsCell: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#2563eb',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  noData: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '672px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  closeButton: {
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  modalContent: {
    padding: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  modalFooter: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: '#f9fafb',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '8px 16px',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  saveButton: {
    padding: '8px 16px',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default AllTransaction
