import React, { useRef, useState } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSKU } from '../../context/SKUContext';
import { useSalesmanModal } from '../../context/SalesmanModalContext';
import { useAuth } from '../../context/AuthContext';

const AllTransaction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { FormatDate, getLoadout, deleteLoadout, getLoadIn, deleteLoadin, getCash_credit, deleteCash_credit, loading } = useTransaction();
  const { salesmans, getAllSalesmen } = useSalesman();
  const { items } = useSKU();

  const [find, setFind] = useState({
    type: "all",
    salesmanCode: "",
    date: "",
    trip: 1
  });

  const [transactions, setTransactions] = useState([]);

  const { openSalesmanModal } = useSalesmanModal();





  const handleEdit = (transaction) => {
    if (!transaction || !transaction.type) return;

    // Navigate to appropriate page with transaction data
    if (transaction.type === 'Load Out') {
      navigate('/transaction/load-out', {
        state: {
          editMode: true,
          editData: transaction
        }
      });
    } else if (transaction.type === 'Load In') {
      navigate('/transaction/load-in', {
        state: {
          editMode: true,
          editData: transaction
        }
      });
    } else if (transaction.type === 'Cash/Credit') {
      navigate('/transaction/cash-credit', {
        state: {
          editMode: true,
          editData: transaction
        }
      });
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    try {
      if (type === 'Load Out') {
        await deleteLoadout(id);
      } else if (type === 'Load In') {
        await deleteLoadin(id);
      } else if (type === 'Cash/Credit') {
        await deleteCash_credit(id);
      }

      // Remove from local state
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

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

  const handleFind = async (e) => {
    e.preventDefault();
    if (!find.date || !find.type || !find.trip || !find.salesmanCode) {
      toast.error("⚠️ Fill all fields");
      return;
    }

    const payload = {
      salesmanCode: find.salesmanCode.trim().toUpperCase(),
      date: find.date,
      trip: find.trip,
      depo: user.depo
    };

    if (find.type === "all") {
      // Fetch all three but don't fail the whole flow if one of them errors.
      try {
        const results = await Promise.allSettled([
          getLoadout(payload),
          getLoadIn(payload),
          getCash_credit(payload),
        ]);

        const [loadoutRes, loadinRes, cashRes] = results;

        const newTransactions = [];

        if (loadoutRes.status === 'fulfilled' && loadoutRes.value) {
          newTransactions.push({ ...loadoutRes.value, type: 'Load Out', id: Date.now() + 1 });
        } else if (loadoutRes.status === 'rejected') {
          console.warn('Loadout fetch failed:', loadoutRes.reason);
        }

        if (loadinRes.status === 'fulfilled' && loadinRes.value) {
          newTransactions.push({ ...loadinRes.value, type: 'Load In', id: Date.now() + 1 });
        } else if (loadinRes.status === 'rejected') {
          console.warn('Loadin fetch failed:', loadinRes.reason);
        }

        if (cashRes.status === 'fulfilled' && cashRes.value) {
          newTransactions.push({ ...cashRes.value, type: 'Cash/Credit', id: Date.now() + 1 });
        } else if (cashRes.status === 'rejected') {
          console.warn('CashCredit fetch failed:', cashRes.reason);
        }

        if (newTransactions.length === 0) {
          toast.error('No records found for the selected criteria');
        } else {
          setTransactions((prev) => [...prev, ...newTransactions]);
        }

        setFind({ salesmanCode: '', trip: 1, type: 'all', date: '' });
      } catch (error) {
        console.error('Unexpected error in all-fetch:', error);
        toast.error('Error fetching records');
      }
    }
    else if (find.type === "loadout") {
      try {
        const loadoutData = await getLoadout(payload);

        const newTransactions = [];

        if (loadoutData) {
          newTransactions.push({
            ...loadoutData,
            type: "Load Out",
            id: Date.now() + 1
          });
        }

        setTransactions([...transactions, ...newTransactions]);

        setFind({
          salesmanCode: "",
          trip: 1,
          type: "all",
          date: ""
        })
      } catch (error) {
        console.error("Error fetching loadout");
      }
    }
    else if (find.type === "loadin") {
      try {
        const loadinData = await getLoadIn(payload);

        const newTransactions = [];

        if (loadinData) {
          newTransactions.push({
            ...loadinData,
            type: "Load In",
            id: Date.now() + 1
          });
        }

        setTransactions([...transactions, ...newTransactions]);

        setFind({
          salesmanCode: "",
          trip: 1,
          type: "all",
          date: ""
        })
      } catch (error) {
        console.error("Error fetching loadin");
      }
    }
    else {
      try {
        const cashCreditData = await getCash_credit(payload);

        const newTransactions = [];

        if (cashCreditData) {
          newTransactions.push({
            ...cashCreditData,
            type: "Cash/Credit",
            id: Date.now() + 1
          });
        }

        setTransactions([...transactions, ...newTransactions]);

        setFind({
          salesmanCode: "",
          trip: 1,
          type: "all",
          date: ""
        })
      } catch (error) {
        console.error("Error fetching data");
      }
    }
  };

  const renderDetails = (transaction) => {
    if (transaction.type === 'Load Out') {
      return (
        <div style={{ fontSize: '14px' }}>
          {transaction.items?.map((item, idx) => (
            <div key={idx} style={{ color: '#666', marginBottom: '4px' }}>
              {item.itemCode?.toUpperCase()}: Qty {item.qty}
            </div>
          ))}
        </div>
      );
    } else if (transaction.type === 'Load In') {
      return (
        <div style={{ fontSize: '14px' }}>
          {transaction.items?.map((item, idx) => {
            const rowItem = Array.isArray(items) ?
              items.find((it) =>
                String(it.code || "").toUpperCase() === String(item.itemCode || "").toUpperCase()
              ) : null;
            if (rowItem.container.toUpperCase() !== "EMT") {
              return (
                <div key={idx} style={{ color: '#666', marginBottom: '4px' }}>
                  {item.itemCode?.toUpperCase()}: Filled {item.Filled}, Burst {item.Burst}
                </div>)
            } else {
              return (
                <div key={idx} style={{ color: '#666', marginBottom: '4px' }}>
                  {item.itemCode?.toUpperCase()}: EMT {item.Emt}
                </div>
              )
            }

          })}
        </div>
      );
    } else if (transaction.type === 'Cash/Credit') {
      // const netValue = transaction.value - transaction.tax - transaction.ref;
      // return (
      //   <div style={{ fontSize: '14px', color: '#666' }}>
      //     <div>CR No: {transaction.crNo}</div>
      //     <div>Value: ₹{transaction.value}</div>
      //     <div>Tax: ₹{transaction.tax} | Ref: ₹{transaction.ref}</div>
      //     <div>Net: ₹{netValue}</div>
      //     <div>Cash: ₹{transaction.cashDeposited} | Cheque: ₹{transaction.chequeDeposited}</div>
      //     {transaction.remark && <div>Remark: {transaction.remark}</div>}
      //   </div>
      // );

      if (transaction && transaction.length > 0) {
        return (
          <div style={{ fontSize: '14px' }}>
            {transaction.map((record, idx) => {
              const netValue = record.value - record.tax - record.ref;
              return (
                <div key={idx} style={{
                  color: '#666',
                  marginBottom: idx < transaction.length - 1 ? '12px' : '0',
                  paddingBottom: idx < transaction.length - 1 ? '12px' : '0',
                  borderBottom: idx < transaction.length - 1 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div style={{ fontWeight: '600', color: '#374151' }}>CR No: {record.crNo}</div>
                  <div>Value: ₹{record.value}</div>
                  <div>Tax: ₹{record.tax} | Ref: ₹{record.ref}</div>
                  <div>Net: ₹{netValue}</div>
                  <div>Cash: ₹{record.cashDeposited} | Cheque: ₹{record.chequeDeposited}</div>
                  {record.remark && <div style={{ fontStyle: 'italic' }}>Remark: {record.remark}</div>}
                </div>
              );
            })}
          </div>
        );


        // Single cash/credit record (backward compatibility)
        const netValue = transaction.value - transaction.tax - (transaction.ref || 0);
        return (
          <div style={{ fontSize: '14px', color: '#666' }}>
            <div style={{ fontWeight: '600', color: '#374151' }}>CR No: {transaction.crNo}</div>
            <div>Value: ₹{transaction.value}</div>
            <div>Tax: ₹{transaction.tax} | Ref: ₹{transaction.ref || 0}</div>
            <div>Net: ₹{netValue}</div>
            <div>Cash: ₹{transaction.cashDeposited} | Cheque: ₹{transaction.chequeDeposited}</div>
            {transaction.remark && <div style={{ fontStyle: 'italic' }}>Remark: {transaction.remark}</div>}
          </div>
        );
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
                value={find.salesmanCode.trim().toUpperCase()}
                onChange={(e) => setFind({ ...find, salesmanCode: e.target.value.trim().toUpperCase() })}
                ref={codeRef}
                onKeyDown={(e) => handleKeyNav(e, "code")}
                placeholder='Enter Salesman code'
              />
              {/* <button
                type="button"
                className="dropdown-btn"
                onClick={() =>
                  openSalesmanModal((code) =>
                    setNewLoadOut(prev => ({ ...prev, salesmanCode: code }))
                  )
                }
              >
                ⌄
              </button> */}
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
            const matchedSalesman = Array.isArray(salesmans)
              ? salesmans.find((sm) => String(sm.codeNo || sm.code || '').toUpperCase() === String(p?.salesmanCode || '').toUpperCase())
              : null;

            return (
              <div key={p?._id || i} className="all-row">
                <div>{p?.type}</div>
                <div>{p?.salesmanCode?.toUpperCase() || ''}</div>
                <div>{matchedSalesman ? matchedSalesman.name : ""} </div>
                {/* <div>₹{calculateNetRate(p?.basePrice, p?.perTax, p?.perDisc)}</div> */}
                <div>{FormatDate(p?.date) || ""}</div>
                <div>{p?.trip} </div>
                <div>{renderDetails(p)} </div>
                <div className="actions">
                  <span className="edit" onClick={() => handleEdit(p)}>
                    Edit
                  </span>
                  {" | "}
                  <span className="delete" onClick={() => handleDelete(p._id, p.type)}>
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


export default AllTransaction
