import React, { useRef, useState } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSKU } from '../../context/SKUContext';

const AllTransaction = () => {
  const navigate = useNavigate();
  const { FormatDate, loadout, getLoadout, updateLoadout, deleteLoadout, loadin, getLoadIn, updateLoadIn, deleteLoadin, cashCredit, getCash_credit, updateCash_credit, deleteCash_credit, loading } = useTransaction();
  const { salesmans } = useSalesman();
  const { items } = useSKU();

  const [find, setFind] = useState({
    type: "all",
    salesmanCode: "",
    date: "",
    trip: 1
  });

  const [editId, setEditId] = useState(null);
  const [activeEdit, setActiveEdit] = useState({
    type: null,
    data: null
  })

  // const handleEdit = (transaction) => {
  //   if (!transaction || !transaction.type) return;

  //   let t = transaction.type.toLowerCase();
  //   if (t.includes("load out")) {
  //     setActiveEdit({ type: "loadout", data: loadout });
  //   } else if (t.includes("load in")) {
  //     setActiveEdit({ type: "loadin", data: loadin });
  //   } else if (t.includes("cash/credit")) {
  //     setActiveEdit({ type: "cashcredit", data: cashCredit });
  //   }
  // };

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
      setTransactions(transactions.filter(t => t._id !== id || t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const [transactions, setTransactions] = useState([
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


  const handleFind = async (e) => {
    e.preventDefault();
    if (!find.date || !find.type || !find.trip || !find.salesmanCode) {
      toast.error("⚠️ Fill all fields");
      return;
    }

    const payload = {
      salesmanCode: find.salesmanCode,
      date: find.date,
      trip: find.trip
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
          {transaction.items?.map((item, idx) => (
            <div key={idx} style={{ color: '#666', marginBottom: '4px' }}>
              {item.itemCode?.toUpperCase()}: Filled {item.Filled}, Burst {item.Burst}
            </div>
          ))}
        </div>
      );
    } else if (transaction.type === 'Cash/Credit') {
      const netValue = transaction.value - transaction.tax - transaction.ref;
      return (
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div>CR No: {transaction.crNo}</div>
          <div>Value: ₹{transaction.value}</div>
          <div>Tax: ₹{transaction.tax} | Ref: ₹{transaction.ref}</div>
          <div>Net: ₹{netValue}</div>
          <div>Cash: ₹{transaction.cashDeposited} | Cheque: ₹{transaction.chequeDeposited}</div>
          {transaction.remark && <div>Remark: {transaction.remark}</div>}
        </div>
      );
    }
  };

  // const renderCashCredit = () => {
  //   return (
  //     <>
  //       <div className="trans-container">
  //         <div className="trans-left">
  //           <form className="trans-form">
  //             <div className="form-group">
  //               <label>Cash/Credit</label>
  //               <select
  //                 value={newCredit.crNo || ""}
  //                 onChange={(e) => setNewCredit({ ...newCredit, crNo: Number(e.target.value) })}
  //               >
  //                 <option value={1}>cash</option>
  //                 <option value={2}>credit</option>
  //               </select>
  //             </div>
  //             <div className="form-group date-input">
  //               <label>Date</label>
  //               <input
  //                 type="date"
  //                 ref={dateRef}
  //                 value={newCredit.date}
  //                 onChange={(e) => setNewCredit({ ...newCredit, date: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "date")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Salesman Code</label>
  //               <input
  //                 type="text"
  //                 placeholder="Enter Salesman Code"
  //                 ref={codeRef}
  //                 value={newCredit.salesmanCode}
  //                 onChange={(e) => setNewCredit({ ...newCredit, salesmanCode: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "code")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Salesman Name</label>
  //               <input
  //                 readOnly
  //                 type="text"
  //                 value={matchedSalesman ? matchedSalesman.name : ""}
  //                 style={{ backgroundColor: "#f5f5f5" }}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Route No.</label>
  //               <input
  //                 readOnly
  //                 type="number"
  //                 value={matchedSalesman ? matchedSalesman.routeNo : ""}
  //                 style={{ backgroundColor: "#f5f5f5" }}
  //               />
  //             </div>

  //           </form>

  //           <div className="item-inputs middle-inputs">
  //             <div className="form-group">
  //               <label>Trip</label>
  //               <input
  //                 type="number"
  //                 ref={tripRef}
  //                 placeholder="Enter Trip no."
  //                 value={newCredit.trip}
  //                 onChange={(e) => setNewCredit({ ...newCredit, trip: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "trip")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Value</label>
  //               <input
  //                 type="number"
  //                 ref={valueRef}
  //                 value={newCredit.value || ""}
  //                 placeholder="Enter Value"
  //                 onChange={(e) => setNewCredit({ ...newCredit, value: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "value")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Tax</label>
  //               <input
  //                 type="number"
  //                 ref={taxref}
  //                 value={newCredit.tax || ""}
  //                 placeholder="% Tax"
  //                 onChange={(e) => setNewCredit({ ...newCredit, tax: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "tax")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>Net Value</label>
  //               <input
  //                 readOnly
  //                 type="number"
  //                 value={calculateNetValue(newCredit?.value, newCredit?.tax)}
  //                 style={{ backgroundColor: "#f5f5f5" }}
  //               />
  //             </div>
  //             <div className="form-group expand-grp" >
  //               <label>Remark</label>
  //               <input
  //                 type="text"
  //                 value={newCredit.remark || ""}
  //                 onChange={(e) => setNewCredit({ ...newCredit, remark: e.target.value })}
  //                 ref={remarkRef}
  //                 onKeyDown={(e) => handleKeyNav(e, "remark")}
  //               />
  //             </div>
  //           </div>

  //           <div className="item-inputs">
  //             <div className="form-group">
  //               <label>DEP/REF</label>
  //               <input
  //                 type="number"
  //                 ref={defRef}
  //                 value={newCredit.ref || ""}
  //                 placeholder="DEP/REF"
  //                 onChange={(e) => setNewCredit({ ...newCredit, ref: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "ref")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>CASH DEPOSITED</label>
  //               <input
  //                 type="number"
  //                 ref={cashRef}
  //                 value={newCredit.cashDeposited || ""}
  //                 placeholder="Cash deposited"
  //                 onChange={(e) => setNewCredit({ ...newCredit, cashDeposited: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "cash")}
  //               />
  //             </div>
  //             <div className="form-group">
  //               <label>CHEQUE DEPOSITED</label>
  //               <input
  //                 type="number"
  //                 ref={chequeRef}
  //                 value={newCredit.chequeDeposited || ""}
  //                 placeholder="Cheque deposited"
  //                 onChange={(e) => setNewCredit({ ...newCredit, chequeDeposited: e.target.value })}
  //                 onKeyDown={(e) => handleKeyNav(e, "cheque")}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <button
  //         className='trans-submit-btn'
  //         ref={submitRef}
  //         onClick={handleSubmit}
  //         onKeyDown={(e) => handleKeyNav(e, "save")}
  //         disabled={loading}
  //       >
  //         {loading ? "Loading..." : "Submit"}
  //       </button>

  //     </>
  //   )
  // };

  // const renderLoadOut = () => {
  //   return (
  //     <>
  //       <div className='trans-container'>
  //         <div className="trans-left">
  //           <form className='trans-form' >
  //             <div className="salesman-detail">
  //               <div className="form-group">
  //                 <label>Salesman Code</label>
  //                 <input
  //                   type="text"
  //                   placeholder="Enter Salesman code"
  //                   value={activeEdit?.data?.salesmanCode}
  //                   onChange={(e) =>
  //                     setNewLoadOut({ ...activeEdit.data, salesmanCode: e.target.value })
  //                   }
  //                   ref={modalCodeRef}
  //                   onKeyDown={(e) => handleKeyNav(e, "code")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Salesman Name</label>
  //                 <input
  //                   readOnly
  //                   type="text"
  //                   value={matchedSalesman ? matchedSalesman.name : ""}
  //                   style={{ backgroundColor: "#f5f5f5" }}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Route No.</label>
  //                 <input
  //                   readOnly
  //                   type="number"
  //                   value={matchedSalesman ? matchedSalesman.routeNo : ""}
  //                   style={{ backgroundColor: "#f5f5f5" }}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Date</label>
  //                 <input
  //                   type="date"
  //                   value={activeEdit?.data?.date}
  //                   onChange={(e) => setNewLoadOut({ ...activeEdit.data, date: e.target.value })}
  //                   ref={modalDateRef}
  //                   onKeyDown={(e) => handleKeyNav(e, "date")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Trip No.</label>
  //                 <input
  //                   type="number"
  //                   placeholder='Enter trip no.'
  //                   value={activeEdit?.data?.trip}
  //                   ref={modalTripRef}
  //                   onChange={(e) => setNewLoadOut({ ...activeEdit?.data, trip: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "trip")}
  //                 />
  //               </div>
  //             </div>
  //           </form>

  //           <div className="item-inputs">
  //             <div className="flex">
  //               <div className="form-group">
  //                 <label>Item Code</label>
  //                 <input
  //                   type="text"
  //                   placeholder='Enter Item code'
  //                   value={activeEdit?.data?.itemCode}
  //                   ref={modalItemRef}
  //                   onChange={(e) => setNewLoadItem({ ...activeEdit.data, itemCode: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "item")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Qty</label>
  //                 <input
  //                   type="number"
  //                   value={activeEdit?.data?.qty}
  //                   ref={modalQtyRef}
  //                   onChange={(e) => setNewLoadItem({ ...activeEdit.data, qty: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "qty")}
  //                 />
  //               </div>
  //               <button type="button" className="add-btn" onKeyDown={(e) => handleKeyNav(e, "add")} onClick={handleAddItem} ref={addRef} >
  //                 ➕ Add Item
  //               </button>
  //             </div>
  //             {/* <div className="form-group">
  //                       <label>Item Name</label>
  //                       <input
  //                           readOnly
  //                           type="text"
  //                           style={{ backgroundColor: "#f5f5f5" }}
  //                       />
  //                   </div> */}
  //             <div className="table">
  //               <div className="trans-table-grid trans-table-header">
  //                 {/* <div>SL.NO.</div> */}
  //                 <div>CODE</div>
  //                 <div>NAME</div>
  //                 <div>Qty</div>
  //                 <div>ACTION</div>
  //               </div>
  //               {loading && <div>Loading...</div>}

  //               {activeEdit?.data?.items.length > 0 ? (
  //                 activeEdit?.data?.items.map((it, index) => {
  //                   const matchedItem = items.find(
  //                     (sku) => sku.code.toUpperCase() === it.itemCode.toUpperCase()
  //                   );
  //                   return (
  //                     <div key={index} className="trans-table-grid trans-table-row">
  //                       <div>{it.itemCode}</div>
  //                       <div>{matchedItem ? matchedItem.name : "-"}</div>
  //                       <div>{it.qty}</div>
  //                       <div className="actions">
  //                         <span
  //                           className="delete"
  //                           onClick={() => handleItemDelete(it.itemCode)}
  //                         >
  //                           Delete
  //                         </span>
  //                       </div>
  //                     </div>
  //                   );
  //                 })
  //               ) : (
  //                 <div className="no-items">No Items added yet!</div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <button onClick={handleSave} className='trans-submit-btn'>Submit</button>
  //     </>
  //   )
  // };

  // const renderLoadIn = () => {
  //   return (
  //     <>
  //       <div className='trans-container'>
  //         <div className="trans-left">
  //           <form className='trans-form' >
  //             <div className="salesman-detail">
  //               <div className="form-group">
  //                 <label>Salesman Code</label>
  //                 <input
  //                   type="text"
  //                   placeholder="Enter Salesman code"
  //                   value={newLoadIn.salesmanCode}
  //                   onChange={(e) =>
  //                     setNewLoadIn({ ...newLoadIn, salesmanCode: e.target.value })
  //                   }
  //                   ref={modalCodeRef}
  //                   onKeyDown={(e) => handleKeyNav(e, "code")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Salesman Name</label>
  //                 <input
  //                   readOnly
  //                   type="text"
  //                   value={matchedSalesman ? matchedSalesman.name : ""}
  //                   style={{ backgroundColor: "#f5f5f5" }}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Route No.</label>
  //                 <input
  //                   readOnly
  //                   type="number"
  //                   value={matchedSalesman ? matchedSalesman.routeNo : ""}
  //                   style={{ backgroundColor: "#f5f5f5" }}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Date</label>
  //                 <input
  //                   type="date"
  //                   value={newLoadIn.date}
  //                   onChange={(e) => setNewLoadIn({ ...newLoadIn, date: e.target.value })}
  //                   ref={modalDateRef}
  //                   onKeyDown={(e) => handleKeyNav(e, "date")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Trip No.</label>
  //                 <input
  //                   type="number"
  //                   placeholder='Enter trip no.'
  //                   value={newLoadIn.trip}
  //                   ref={modalTripRef}
  //                   onChange={(e) => setNewLoadIn({ ...newLoadIn, trip: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "trip")}
  //                 />
  //               </div>
  //             </div>
  //           </form>

  //           <div className="item-inputs">
  //             <div className="flex">
  //               <div className="form-group">
  //                 <label>Item Code</label>
  //                 <input
  //                   type="text"
  //                   placeholder='Enter Item code'
  //                   value={newLoadItem.itemcode}
  //                   ref={modalItemRef}
  //                   onChange={(e) => setNewLoadItem({ ...newLoadItem, itemcode: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "itemcode")}
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Filled</label>
  //                 <input
  //                   type="number"
  //                   value={newLoadItem.Filled}
  //                   ref={modalFilledRef}
  //                   onChange={(e) => setNewLoadItem({ ...newLoadItem, Filled: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "Filled")}
  //                   placeholder="Enter Qty/-"
  //                 />
  //               </div>
  //               <div className="form-group">
  //                 <label>Burst</label>
  //                 <input
  //                   type="number"
  //                   value={newLoadItem.Burst}
  //                   ref={modalBurstRef}
  //                   onChange={(e) => setNewLoadItem({ ...newLoadItem, Burst: e.target.value })}
  //                   onKeyDown={(e) => handleKeyNav(e, "Burst")}
  //                   placeholder="Enter Qty/-"
  //                 />
  //               </div>



  //               <button type="button" className="add-btn add-btn-load-in" onKeyDown={(e) => handleKeyNav(e, "add")} onClick={handleAddItem} ref={addRef} >
  //                 ➕ Add
  //               </button>
  //             </div>
  //             <div className="table">
  //               <div className="trans-loadin-table-grid trans-table-header">
  //                 {/* <div>SL.NO.</div> */}
  //                 <div>CODE</div>
  //                 <div>NAME</div>
  //                 <div>Filled</div>
  //                 <div>Burst</div>
  //                 <div>ACTION</div>
  //               </div>
  //               {loading && <div>Loading...</div>}

  //               {newLoadIn.items.length > 0 ? (
  //                 newLoadIn.items.map((it, index) => {
  //                   const matchedItem = items.find(
  //                     (sku) => String(sku.code || '').toUpperCase() === String(it.itemCode || it.itemcode || '').toUpperCase()
  //                   );
  //                   return (
  //                     <div key={index} className="trans-loadin-table-grid trans-table-row">
  //                       <div>{it.itemCode}</div>
  //                       <div>{matchedItem ? matchedItem.name : "-"}</div>
  //                       <div>{it.Filled}</div>
  //                       <div>{it.Burst}</div>
  //                       <div className="actions">
  //                         <span
  //                           className="delete"
  //                           onClick={() => handleDelete(it.itemCode)}
  //                         >
  //                           Delete
  //                         </span>
  //                       </div>


  //                     </div>
  //                   );
  //                 })
  //               ) : (
  //                 <div className="no-items">No Items added yet!</div>
  //               )}

  //             </div>
  //           </div>
  //         </div>
  //         <div className="trans-table trans-grid">

  //         </div>
  //       </div>
  //       <button className='trans-submit-btn' onClick={handleSubmit}>Submit</button>
  //     </>
  //   )
  // };


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
