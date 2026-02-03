import React from 'react'
import api from "../../api/api.js";
import { useState, useEffect, useRef } from 'react';
import "../transaction/transaction.css";
import { useSalesman } from '../../context/SalesmanContext.jsx';
import { useDepo } from '../../context/depoContext';
import { useAuth } from '../../context/AuthContext'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import pepsiLogo from "../../assets/pepsi_logo.png";

const ShortExcess = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getAllSalesmen } = useSalesman();
    const { depos } = useDepo();
    const { user } = useAuth();
    const startRef = useRef(null);
    const endRef = useRef(null);
    const findRef = useRef(null);

    const getDepo = (depo) => {
        if (!depo || !Array.isArray(depos)) return "";
        const id = String(depo).trim();
        const matchDepo = depos.find((d) => String(d._id).trim() === id);
        return matchDepo;
    }
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
                default:
                    break;
            }
        }
    }


    const handleFind = async () => {
        if (!startDate || !endDate) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await api.get(
                `/summary/short-excess-summary?startDate=${startDate}&endDate=${endDate}`
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


    const exportSummaryPDF = async () => {
        if (!rows.length) {
            alert("No data to export");
            return;
        }

        const doc = new jsPDF();

        const logoBase64 = await loadImageBase64(pepsiLogo);
        doc.addImage(logoBase64, "PNG", 12, 5, 35, 18);

        doc.setFontSize(14);
        doc.text("SAN BEVERAGES PVT LTD", 105, 15, { align: "center" });
        doc.setFontSize(8);
        doc.text(getDepo(user.depo)?.depoAddress || "", 105, 22, { align: "center" });

        doc.setFontSize(10);
        doc.text("SHORT/EXCESS SUMMARY REPORT", 105, 29, { align: "center" });

        const tableData = rows.map((r, i) => [
            i + 1,
            r.salesmanCode,
            r.salesmanName,
            r.qtySale,
            r.netSaleAmount.toFixed(2),
            r.totalDeposit,
            r.shortExcess
        ]);

        autoTable(doc, {
            startY: 35,
            head: [["SL", "SALESMAN CODE", "NAME", "QTY SALE", "NET SALE AMT", "TOTAL DEPOSIT", "SHORT/EXCESS"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        const blob = doc.output("bloburl");
        const w = window.open(blob);
        w.onload = () => w.print();
    };

    const exportSummaryExcel = async () => {
        if (!rows.length) {
            alert("No data to export");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Summary");

        const logoBase64 = await loadImageBase64(pepsiLogo);

        const imageId = workbook.addImage({
            base64: logoBase64,
            extension: "png"
        });

        sheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 120, height: 70 }
        });

        sheet.mergeCells("C2:J2");
        sheet.mergeCells("C3:J3");
        sheet.mergeCells("C5:J5");

        sheet.getCell("C2").value = "SAN BEVERAGES PVT LTD";
        sheet.getCell("C3").value = getDepo(user.depo)?.depoAddress || "";
        sheet.getCell("C5").value = "SHORT/EXCESS SUMMARY REPORT";

        sheet.getCell("C2").alignment = { horizontal: "center" };
        sheet.getCell("C3").alignment = { horizontal: "center" };
        sheet.getCell("C5").alignment = { horizontal: "center" };


        sheet.getCell("B2").font = { bold: true, size: 14 };
        sheet.getCell("B3").font = { size: 11 };
        sheet.getCell("B5").font = { bold: true };

        sheet.getRow(7).values = [
            "SL", "SALESMAN CODE", "NAME", "QTY SALE", "NET SALE AMT", "TOTAL DEPOSIT", "SHORT/EXCESS"
        ];

        sheet.getRow(7).font = { bold: true };

        rows.forEach((r, i) => {
            sheet.addRow([
                i + 1,
                r.salesmanCode,
                r.salesmanName,
                r.qtySale,
                r.netSaleAmount.toFixed(2),
                r.totalDeposit.toFixed(2),
                r.shortExcess?.toFixed(2)
            ]);
        });

        sheet.columns = [
            { width: 6 },
            { width: 14 },
            { width: 30 },
            { width: 12 },
            { width: 14 },
            { width: 14 },
            { width: 14 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "salesman-wise-summary.xlsx");
    };

    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">

                        <div className="form-group">
                            <label>Start-date</label>
                            <input
                                ref={startRef}
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                onKeyDown={(e) => handleKeyNav(e, "startDate")}
                            />

                        </div>
                        <div className="form-group">
                            <label>End-date</label>
                            <input
                                ref={endRef}
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                onKeyDown={(e) => handleKeyNav(e, "endDate")}
                            />
                        </div>
                        <div className="form-group">
                            <button className="export-btn pdf" onClick={exportSummaryPDF}>
                                🖨️ Print
                            </button>
                        </div>

                        <div> <button className="export-btn excel" onClick={exportSummaryExcel}>
                            📊 Excel
                        </button></div>

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
                        <div>SalesmanCode</div>
                        <div>Name</div>
                        <div>Qty Sale</div>
                        <div>Net Sale Amt</div>
                        <div>Total Deposit</div>
                        <div>Short/Excess</div>
                    </div>

                    {rows.length === 0 && (
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            No data found
                        </div>
                    )}

                    {rows.map((r, i) => (
                        <div className="all-row6" key={i}>
                            <div>{r.salesmanCode}</div>
                            <div>{r.salesmanName}</div>
                            <div>{r.qtySale}</div>
                            <div>₹{r.netSaleAmount}</div>
                            <div>₹{r.totalDeposit.toFixed(2)}</div>
                            <div>{(r.shortExcess >= 0) &&
                                (<div style={{
                                    color: "green"
                                }}> ₹{r.shortExcess.toFixed(2)}</div>)}

                                {(r.shortExcess < 0) &&
                                    (
                                        <div style={{
                                            color: "red"
                                        }}> ₹{r.shortExcess.toFixed(2)}</div>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ShortExcess