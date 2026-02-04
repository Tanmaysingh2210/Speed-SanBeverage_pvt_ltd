import React, { useRef, useState } from 'react'
import "./transaction.css";
import { useTransaction } from '../../context/TransactionContext';
import { useSalesman } from '../../context/SalesmanContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useSKU } from '../../context/SKUContext';
import { useSalesmanModal } from '../../context/SalesmanModalContext';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDepo } from '../../context/depoContext';
import { useAuth } from '../../context/AuthContext'
import pepsiLogo from "../../assets/pepsi_logo.png";
import ExcelJS from "exceljs";

const AllTransaction = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { FormatDate, getLoadout, deleteLoadout, getLoadIn, deleteLoadin, getCash_credit, deleteCash_credit, loading } = useTransaction();
  const { salesmans } = useSalesman();
  const { items } = useSKU();
  const { openSalesmanModal } = useSalesmanModal();

  const [find, setFind] = useState({
    type: "all",
    salesmanCode: "",
    date: "",
    trip: 1
  });

  const loadImageBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = url;
    });

  const [transactions, setTransactions] = useState([]);

  const getDepo = (depo) => {
    if (!depo || !Array.isArray(depos)) return "";
    const id = String(depo).trim();
    const matchDepo = depos.find((d) => String(d._id).trim() === id);
    return matchDepo;
  }
  const { depos } = useDepo();
  const { user } = useAuth();
  const getDetailsText = (t) => {
    if (t.type === "Load Out") {
      return t.items?.map(i => `${i.itemCode}: ${i.qty}`).join(", ");
    }

    if (t.type === "Load In") {
      return t.items?.map(i =>
        i.Emt ? `${i.itemCode}: EMT ${i.Emt}` : `${i.itemCode}: Filled ${i.Filled}`
      ).join(", ");
    }

    if (t.type === "Cash" || t.type === "Credit") {
      return `₹${t.value} | Tax ₹${t.tax} | Ref ₹${t.ref || 0}`;
    }

    return "";
  };

  const exportPDF = async () => {
    if (!transactions.length) {
      showToast("No transactions to export", "error");
      return;
    }

    const doc = new jsPDF();

    const logoBase64 = await loadImageBase64(pepsiLogo);

    // Logo
    doc.addImage(logoBase64, "PNG", 12, 3, 45, 25);

    // HEADER
    doc.setFontSize(14);
    doc.text("SAN BEVERAGES PVT LTD", 105, 15, { align: "center" });
    doc.setFontSize(8);
    doc.text(

      // getDepo(user.depo)?.depoName || "",
      getDepo(user.depo)?.depoAddress || "",

      105,
      22,
      { align: "center" }
    );
    doc.setFontSize(10);
    doc.text("TRANSACTION REPORT", 105, 30, { align: "center" });

    const tableData = transactions.map((t, i) => [
      i + 1,
      t.type,
      t.salesmanCode?.toUpperCase(),
      FormatDate(t.date),
      t.trip,
      getDetailsText(t)
    ]);

    autoTable(doc, {
      startY: 32,
      head: [[
        "SL",
        "TYPE",
        "SALESMAN",
        "DATE",
        "TRIP",
        "DETAILS"
      ]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const pdfBlob = doc.output("bloburl");

    const printWindow = window.open(pdfBlob);
    printWindow.onload = () => {
      printWindow.print();
    };
  };


  const exportExcel = async () => {
    if (!transactions.length) {
      showToast("No transactions to export", "error");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Transactions");

    const logoBase64 = await loadImageBase64(pepsiLogo);

    const imageId = workbook.addImage({
      base64: logoBase64,
      extension: "png"
    });

    sheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 120, height: 70 }
    });

    sheet.mergeCells("C2:H2");
    sheet.mergeCells("C3:H3");
    sheet.mergeCells("C5:H5");

    sheet.getCell("C2").value = "SAN BEVERAGES PVT LTD";
    sheet.getCell("C3").value = getDepo(user.depo)?.depoAddress || "";
    sheet.getCell("C5").value = "TRANSACTION REPORT";

    sheet.getCell("C2").alignment = { horizontal: "center" };
    sheet.getCell("C3").alignment = { horizontal: "center" };
    sheet.getCell("C5").alignment = { horizontal: "center" };

    sheet.getCell("C2").font = { bold: true, size: 14 };
    sheet.getCell("C3").font = { size: 11 };
    sheet.getCell("C5").font = { bold: true };

    sheet.getRow(7).values = [
      "SL",
      "TYPE",
      "SALESMAN",
      "DATE",
      "TRIP",
      "DETAILS"
    ];

    sheet.getRow(7).font = { bold: true };

    transactions.forEach((t, i) => {
      sheet.addRow([
        i + 1,
        t.type,
        t.salesmanCode?.toUpperCase(),
        FormatDate(t.date),
        t.trip,
        getDetailsText(t)
      ]);
    });

    sheet.columns = [
      { width: 6 },
      { width: 14 },
      { width: 14 },
      { width: 14 },
      { width: 8 },
      { width: 40 }
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "transactions-report.xlsx");
  };

  const handleEdit = (transaction) => {
    if (!transaction || !transaction.type) return;

    if (transaction.type === 'Load Out') {
      navigate('/transaction/load-out', {
        state: { editMode: true, editData: transaction }
      });
    }
    else if (transaction.type === 'Load In') {
      navigate('/transaction/load-in', {
        state: { editMode: true, editData: transaction }
      });
    }
    else if (transaction.type === 'Cash' || transaction.type === 'Credit') {
      navigate('/transaction/cash-credit', {
        state: { editMode: true, editData: transaction }
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
      } else if (type === 'Cash' || type === 'Credit') {
        await deleteCash_credit(id);
      }

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
      showToast("⚠️ Fill all fields", "error");
      return;
    }

    const payload = {
      salesmanCode: find.salesmanCode.trim().toUpperCase(),
      date: find.date,
      trip: find.trip,
    };

    if (find.type === "all") {
      try {
        const [loadoutRes, loadinRes, cashRes] = await Promise.allSettled([
          getLoadout(payload),
          getLoadIn(payload),
          getCash_credit(payload),
        ]);

        const newTransactions = [];

        if (loadoutRes.status === 'fulfilled' && loadoutRes.value) {
          newTransactions.push({ ...loadoutRes.value, type: 'Load Out', id: Date.now() });
        } else if (loadoutRes.status === 'rejected') {
          console.warn('Loadout fetch failed:', loadoutRes.reason);
        }

        if (loadinRes.status === 'fulfilled' && loadinRes.value) {
          newTransactions.push({ ...loadinRes.value, type: 'Load In', id: Date.now() });
        } else if (loadinRes.status === 'rejected') {
          console.warn('Loadin fetch failed:', loadinRes.reason);
        }

        if (cashRes.status === 'fulfilled' && Array.isArray(cashRes.value)) {
          cashRes.value.forEach((record) => {
            newTransactions.push({
              ...record,
              type: record.crNo === 1 ? 'Cash' : 'Credit',
              id: `${record._id}-cashcredit`
            });
          });
          console.log("newTransaction", newTransactions)
        } else if (cashRes.status === 'rejected') {
          console.warn('CashCredit fetch failed:', cashRes.reason);
        }

        if (newTransactions.length === 0) {
          showToast('No records found for the selected criteria', 'error');
        } else {
          setTransactions((prev) => [...prev, ...newTransactions]);
        }

        setFind({ salesmanCode: '', trip: 1, type: 'all', date: '' });
      } catch (error) {
        console.error('Unexpected error in all-fetch:', error);
        showToast('Error fetching records', 'error');
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
    } else if (transaction.type === 'Cash' || transaction.type === 'Credit') {
      const netValue = transaction.value + ((transaction.tax || 0) * (transaction.value) / 100) - (transaction.ref || 0);

      return (
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div>Value: ₹{transaction.value}</div>
          <div>Tax: {transaction.tax}% | Ref: ₹{transaction.ref || 0}</div>


          {transaction.type === 'Cash' && (
            <div>Cash: ₹{transaction.cashDeposited}</div>
          )}

          {transaction.type === 'Cash' && (
            <div>Cheque: ₹{transaction.chequeDeposited}</div>
          )}

          <div>Net: ₹{netValue}</div>

        </div>
      );
    }

  };

  return (
    <div className='trans'>
      <div className="trans-container" >
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
              <div className="input-with-btn">
                <input
                  type="text"
                  value={find.salesmanCode.trim().toUpperCase()}
                  onChange={(e) => setFind({ ...find, salesmanCode: e.target.value.trim().toUpperCase() })}
                  ref={codeRef}
                  onKeyDown={(e) => handleKeyNav(e, "code")}
                  placeholder='Enter Salesman code'
                />
                <button
                  type="button"
                  className="dropdown-btn"
                  onClick={() =>
                    openSalesmanModal((code) =>
                      setFind(prev => ({ ...prev, salesmanCode: code }))
                    )
                  }
                >
                  ⌄
                </button>
              </div>
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
            {/* <div style={{ display: "flex", gap: "10px" }}>

              <button className="export-btn pdf" onClick={exportPDF}>
                📄 Export PDF
              </button>

              <button className="export-btn excel" onClick={exportExcel}>
                📊 Export Excel
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="trans-container  set-margin" style={{ maxHeight: "50vh" }}>
        <div className="all-table">
          <div className="headerr">
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

          {transactions.map((p, i) => {
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
