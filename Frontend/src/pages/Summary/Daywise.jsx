import React from 'react';
import { useState, useEffect, useRef } from "react";
import "../transaction/transaction.css";
import api from "../../api/api";
import toast from "react-hot-toast";
import { useTransaction } from "../../context/TransactionContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import pepsiLogo from "../../assets/pepsi_logo.png";
import { useDepo } from '../../context/depoContext';
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext';
const DayWise = () => {

    const [period, setPeriod] = useState({ startDate: "", endDate: "" });

    const { FormatDate } = useTransaction();
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();


    const getSummary = async (e) => {

        e.preventDefault();
        if (!period.startDate || !period.endDate || period.startDate > period.endDate) {
            showToast("Fill both date properly", "error");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/summary/daywise', period);
            if (res?.data?.success) {
                setSummary(res?.data?.data);

            }
            console.log(res.data.data);

            showToast("day-wise summary fetch successfull", "success");
        }
        catch (err) {
            showToast(err.response?.data?.message || "Error fetching summary", "error");

        } finally {
            setLoading(false);
        }
    }


    const startRef = useRef(null);
    const endRef = useRef(null);
    const findRef = useRef(null);
    const { depos } = useDepo();
    const { user } = useAuth();
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
    const loadImageBase64 = (url) =>
        new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.src = url;
        });

    const exportSummaryPDF = async () => {
        if (!summary.length) {
            showToast("No data to export", "error");
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
        doc.text("DAYWISE SUMMARY", 105, 29, { align: "center" });

        const tableData = summary.map((r, i) => [
            i + 1,
            r.date,
            `${r.grossSale - r.schm}`,
            r.schm,
            r.grossSale,
            r.refund,
            r.creditSale,
            `${r.cashDeposited}/${r.chequeDeposited}`,
            `${r.shortExcess}`
        ]);

        tableData.push([
            "",
            "TOTAL",
            totalNetSale.toFixed(2),
            totalSchm.toFixed(2),
            totalGrossSale.toFixed(2),
            totalRefund.toFixed(2),
            totalCreditSale.toFixed(2),
            `${totalCashDeposited}/${totalChequeDeposited}`,
            totalShortExcess.toFixed(2)
        ]);


        autoTable(doc, {
            startY: 35,
            head: [["SL", "DATE", "NET SALE", "SCHM", "GROSS SALE", "REFUND", "CREDIT SALE", "CASH/CHEQUE", "SHORT/EXCESS"]],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },

            didParseCell(data) {
                if (data.row.index === tableData.length - 1) {
                    data.cell.styles.fontStyle = "bold";
                }
            }
        });

        const blob = doc.output("bloburl");
        const w = window.open(blob);
        w.onload = () => w.print();
    };

    const exportSummaryExcel = async () => {
        if (!summary.length) {
            showToast("No data to export", "error");
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
        sheet.getCell("C5").value = "DAYWISE SUMMARY REPORT";

        sheet.getCell("C2").alignment = { horizontal: "center" };
        sheet.getCell("C3").alignment = { horizontal: "center" };
        sheet.getCell("C5").alignment = { horizontal: "center" };


        sheet.getCell("B2").font = { bold: true, size: 14 };
        sheet.getCell("B3").font = { size: 11 };
        sheet.getCell("B5").font = { bold: true };

        sheet.getRow(7).values = [
            "SL", "DATE", "NET SALE", "SCHM", "GROSS SALE", "REFUND", "CREDIT SALE", "CASH/CHEQUE", "SHORT/EXCESS"
        ];

        sheet.getRow(7).font = { bold: true };

        summary.forEach((r, i) => {
            sheet.addRow([
                i + 1,
                r.date,
                `${r.grossSale - r.schm}`,
                r.schm,
                r.grossSale,
                r.refund,
                r.creditSale,
                `${r.cashDeposited}/${r.chequeDeposited}`,
                `${r.shortExcess}`
            ]);


        });
        const totalRow = sheet.addRow([
            "",
            "TOTAL",
            totalNetSale.toFixed(2),
            totalSchm.toFixed(2),
            totalGrossSale.toFixed(2),
            totalRefund.toFixed(2),
            totalCreditSale.toFixed(2),
            `${totalCashDeposited}/${totalChequeDeposited}`,
            totalShortExcess.toFixed(2)
        ]);

        totalRow.font = { bold: true };


        sheet.columns = [
            { width: 6 },
            { width: 20 },
            { width: 30 },
            { width: 12 },
            { width: 14 },
            { width: 14 },
            { width: 14 },
            { width: 25 },
            { width: 25 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "day-wise-summary.xlsx");
    };

    const totalNetSale = summary.reduce((sum, p) => sum + (Number(p.grossSale || 0) - Number(p.schm || 0)), 0);
    const totalSchm = summary.reduce((sum, p) => sum + (Number(p.schm || 0)), 0);
    const totalGrossSale = summary.reduce((sum, p) => sum + (Number(p.grossSale || 0)), 0);
    const totalRefund = summary.reduce((sum, p) => sum + (Number(p.refund || 0)), 0);
    const totalCreditSale = summary.reduce((sum, p) => sum + (Number(p.creditSale || 0)), 0);
    const totalCashDeposited = summary.reduce((sum, p) => sum + (Number(p.cashDeposited || 0)), 0);
    const totalChequeDeposited = summary.reduce((sum, p) => sum + (Number(p.chequeDeposited || 0)), 0);
    const totalShortExcess = summary.reduce((sum, p) => sum + (Number(p.shortExcess || 0)), 0);

    return (
        <div className='trans'>
            <div className="trans-container">
                <div className="trans-up">
                    <div className="flex">
                        <div className="form-group">
                            <label>Start-date</label>
                            <input
                                ref={startRef}
                                value={period.startDate}
                                type="date"
                                onChange={(e) => setPeriod({ ...period, startDate: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "startDate")}
                            />
                        </div>
                        <div className="form-group">
                            <label>End-date</label>
                            <input
                                ref={endRef}
                                type="date"
                                value={period.endDate}
                                onChange={(e) => setPeriod({ ...period, endDate: e.target.value })}
                                onKeyDown={(e) => handleKeyNav(e, "endDate")}
                            />
                        </div>
                        <div className="form-group pdf">
                            <button
                                className="padd trans-submit-btn"
                                disabled={loading}
                                ref={findRef}
                                onKeyDown={(e) => handleKeyNav(e, "find")}
                                onClick={getSummary}
                            >
                                {loading ? "Wait..." : "Find"}

                            </button>
                            <button className="export-btn pdf padd trans-submit-btn" onClick={exportSummaryPDF}>
                                🖨️ Print
                            </button>

                            <button className="export-btn excel pdf padd trans-submit-btn" onClick={exportSummaryExcel}>
                                📊 Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trans-container set-margin">
                <div className="all-table">
                    <div className="all-row5 header">
                        <div>DATE</div>
                        <div>NET SALE</div>
                        <div>SCHM</div>
                        <div>GROSS SALE</div>
                        <div>REFUND</div>
                        <div>CREDIT SALE</div>
                        <div>CASH/CHEQUE</div>
                        <div>SHORT/EXCESS</div>

                    </div>
                    {loading && (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            Fetching summary...
                        </div>
                    )}

                    {
                        summary.length === 0 && (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#666',
                                backgroundColor: 'white'
                            }}>
                                No items found
                            </div>
                        )
                    }
                    {summary.map((p, i) => {
                        const netSale = Number(p.grossSale || 0) - Number(p.schm || 0);
                        return (
                            <div key={i} className="all-row5">
                                <div>{FormatDate(p.date)}</div>
                                <div>{netSale}</div>
                                <div>₹ {p.schm}</div>
                                <div>₹{p.grossSale} </div>
                                <div>₹ {p.refund}</div>
                                <div>₹ {p.creditSale}</div>
                                <div>₹{p.cashDeposited} /₹ {p.chequeDeposited}</div>


                                <div>₹ {p.shortExcess}</div>
                            </div>
                        )
                    })}
                    {summary.length > 0 &&
                        <div className="all-row5 total-row">

                            <div><strong>Total</strong></div>
                            <div>₹{totalNetSale}</div>
                            <div >₹ {totalSchm}</div>
                            <div >₹{totalGrossSale} </div>
                            <div >₹ {totalRefund}</div>
                            <div >₹ {totalCreditSale}</div>
                            <div >₹{totalCashDeposited} /₹ {totalChequeDeposited}</div>
                            <div style={{ color: totalShortExcess >= 0 ? "green" : "red" }}>₹ {totalShortExcess}</div>
                        </div>
                    }



                </div>
            </div>
        </div>

    )
}
export default DayWise;