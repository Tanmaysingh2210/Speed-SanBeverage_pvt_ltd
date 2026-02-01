import React, { useState, useRef, useEffect } from "react";
import "./Prices.css";
import { usePrice } from "../../context/PricesContext";
import { useSKU } from "../../context/SKUContext";
import toast from "react-hot-toast";
import { useItemModal } from '../../context/ItemModalContext';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import pepsiLogo from "../../assets/pepsi_logo.png";
import ExcelJS from "exceljs";
import { useDepo } from '../../context/depoContext';
import { useAuth } from '../../context/AuthContext'
// import '../../pages/transaction/transaction.css'
const LatestPrice = () => {
    const { prices, updatePrice, deletePrice, addPrice, loading } = usePrice();
    const { items } = useSKU();
    const [itemShow, setItemShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [newPrice, setNewPrice] = useState({
        code: "",
        basePrice: "",
        perTax: "",
        date: "",
        perDisc: "",
        status: "Active",
    });
    const [modalQtyMap, setModalQtyMap] = useState({});
    const { openItemModal } = useItemModal();
    const codeRef = useRef(null);
    const baseRef = useRef(null);
    const taxRef = useRef(null);
    const dateRef = useRef(null);
    const statusRef = useRef(null);
    const saveRef = useRef(null);
    const discRef = useRef(null);
    const modalRef = useRef(null);
    const { depos } = useDepo();
    const { user } = useAuth();

    const getDepo= (depo) => {
        if (!depo || !Array.isArray(depos)) return "";
        const id = String(depo).trim();
        const matchDepo = depos.find((d) => String(d._id).trim() === id);
        return matchDepo ;
    }

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


    const exportPDF = async () => {
    const doc = new jsPDF();

    const logoBase64 = await loadImageBase64(pepsiLogo);

    // Logo
    doc.addImage(logoBase64, "PNG", 12, 3, 45, 25);

    // Header
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
    doc.text("LATEST PRICE REPORT", 105, 29, { align: "center" });

    const tableData = filtered.map((p, i) => {
        const rowItem = items.find(
            it =>
                String(it.code || it.itemCode || "").toUpperCase() ===
                String(p.itemCode || "").toUpperCase()
        );

        return [
            i + 1,
            p.itemCode,
            rowItem?.name || "",
            p.basePrice,
            `${p.perDisc}%`,
            `${p.perTax}%`,
            calculateNetRate(p.basePrice, p.perTax, p.perDisc),
            formatDate(p.date)
        ];
    });

    autoTable(doc, {
        startY: 32,
        head: [[
            "SL",
            "CODE",
            "NAME",
            "BASE",
            "DISC %",
            "TAX %",
            "NET RATE",
            "DATE"
        ]],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // 🔥 THIS PART ENABLES PRINT + PDF PREVIEW
    const pdfBlob = doc.output("bloburl");

    const printWindow = window.open(pdfBlob);
    printWindow.onload = () => {
        printWindow.print();
    };
};





    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Latest Price");

        // Load logo
        const logoBase64 = await loadImageBase64(pepsiLogo);

        const imageId = workbook.addImage({
            base64: logoBase64,
            extension: "png"
        });

        sheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 120, height: 70 }
        });

        // Header text
        sheet.mergeCells("C2:J2");
        sheet.mergeCells("C3:J3");
        sheet.mergeCells("C5:J5");

        sheet.getCell("C2").value = "SAN BEVERAGES PVT LTD";
        sheet.getCell("C3").value = getDepo(user.depo)?.depoAddress || "";
        sheet.getCell("C5").value = "LATEST PRICE REPORT";

        sheet.getCell("C2").alignment = { horizontal: "center" };
        sheet.getCell("C3").alignment = { horizontal: "center" };
        sheet.getCell("C5").alignment = { horizontal: "center" };


        sheet.getCell("B2").font = { bold: true, size: 14 };
        sheet.getCell("B3").font = { size: 11 };
        sheet.getCell("B5").font = { bold: true };

        sheet.getRow(7).values = [
            "SL NO",
            "CODE",
            "NAME",
            "BASE PRICE",
            "DISC %",
            "TAX %",
            "NET RATE",
            "DATE"
        ];

        sheet.getRow(7).font = { bold: true };

        filtered.forEach((p, i) => {
            const rowItem = items.find(
                it =>
                    String(it.code || it.itemCode || "").toUpperCase() ===
                    String(p.itemCode || "").toUpperCase()
            );

            sheet.addRow([
                i + 1,
                p.itemCode,
                rowItem?.name || "",
                p.basePrice,
                p.perDisc,
                p.perTax,
                calculateNetRate(p.basePrice, p.perTax, p.perDisc),
                formatDate(p.date)
            ]);
        });

        sheet.columns = [
            { width: 8 },
            { width: 12 },
            { width: 30 },
            { width: 14 },
            { width: 10 },
            { width: 10 },
            { width: 14 },
            { width: 14 }
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "latest-price-report.xlsx");
    };




    const calculateNetRate = (basePrice, perTax, perDisc) => {
        if (!basePrice) return '';
        let taxablePrice = (parseFloat(basePrice) - (parseFloat(basePrice) * parseFloat(perDisc || 0) / 100)).toFixed(2);
        return (parseFloat(taxablePrice) + (parseFloat(taxablePrice) * parseFloat(perTax || 0) / 100)).toFixed(2);
    };

    useEffect(() => {
        if (showModal) {
            setTimeout(() => codeRef.current?.focus(), 100);
        }
    }, [showModal]);

    // Auto update name when code changes
    const matchedItem =
        Array.isArray(items)
            ? items.find(
                (it) =>
                    String(it.code || it.itemCode || '').toUpperCase() ===
                    String(newPrice.code || '').toUpperCase()
            )
            : null;


    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "save") {
                saveRef.current?.click();
                return;
            }

            switch (currentField) {
                case "code":
                    baseRef.current?.focus();
                    break;
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
                case "basePrice":
                    codeRef.current?.focus();
                    break;
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

    const formatDate = (isoDate) => { //yyyy-mm-dd
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; //dd-mm-yyyy
    };


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };
        if (showModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);



    const handleSave = async (e) => {
        e.preventDefault();

        if (!newPrice.basePrice || !newPrice.code || !newPrice.date) {
            toast.error("⚠️ Please fill all fields!");
            return;
        }

        const payload = {
            code: newPrice.code.trim().toUpperCase(),
            basePrice: Number(newPrice.basePrice),
            perTax: Number(newPrice.perTax) || 0,
            perDisc: Number(newPrice.perDisc) || 0,
            date: newPrice.date, // backend expects `date` (lowercase)
            status: editId ? newPrice.status : "Active", //  Force Active for new prices
        };


        try {
            if (editId) {
                await updatePrice(editId, payload);
            } else {
                await addPrice(payload);
            };

            setShowModal(false);
            setEditId(null);
            setNewPrice({
                code: "",
                name: "",
                basePrice: "",
                perDisc: "",
                perTax: "",
                date: "",
                netRate: "",
                status: "Active",
            });

        } catch (err) {
            console.error(err?.response?.data?.message || "Error adding or editing price");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this price?")) {
            await deletePrice(id);
        }
    };

    const handleEdit = (price) => {
        setEditId(price._id);

        setNewPrice({
            code: price.itemCode.trim().toUpperCase() || "",
            basePrice: price.basePrice || "",
            perDisc: price.perDisc || "",
            perTax: price.perTax || "",
            date: price.date ? price.date.split("T")[0] : "",
            status: price.status || "Active"
        });
        setShowModal(true);
    };

    // Filter prices by search term
    const safeString = v => (v === null || v === undefined) ? '' : String(v);

    // Safe filtered list
    const filtered = Array.isArray(prices)
        ? prices
            .filter(p => p?.status === "Active") //  Only show active prices
            .filter(p => safeString(p?.name).toLowerCase().includes(safeString(search).toLowerCase()))
        : [];

    return (
        <div className="price-container">
            {/* Header */}
            <div className="price-header">
                <input
                    type="text"
                    placeholder="🔍 Search Items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="price-search"
                />

                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="export-btn pdf" onClick={exportPDF}>
                        📄 Export PDF
                    </button>

                    <button className="export-btn excel" onClick={exportExcel}>
                        📊 Export Excel
                    </button>
                    <button
                        className="price-add-btn"
                        disabled={loading}
                        onClick={() => {
                            setShowModal(true);
                            setEditId(null);
                            setNewPrice({
                                code: "",
                                name: "",
                                basePrice: "",
                                perTax: "",
                                perDisc: "",
                                date: "",
                                netRate: "",
                                status: "Active",
                            });
                        }}
                    >
                        + New Price
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}

            {/* Table */}
            <div className="price-table">
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

                {filtered.length === 0 && !loading && (
                    <div className="no-data">No prices found</div>
                )}

                {filtered.map((p, i) => {
                    const rowItem = Array.isArray(items)
                        ? items.find((it) =>
                            String(it.code || it.itemCode || "").toUpperCase() ===
                            String(p.itemCode || "").toUpperCase()
                        )
                        : null;

                    return (
                        <div key={p?._id || i} className="price-row">
                            <div>{i + 1}</div>
                            <div>{p?.itemCode?.toUpperCase() || ''}</div>
                            <div>{rowItem?.name || ''}</div>
                            <div>{p?.basePrice || 0}</div>
                            <div>{p?.perDisc || 0}%</div>
                            <div>{p?.perTax || 0}%</div>
                            <div>{calculateNetRate(p?.basePrice, p?.perTax, p?.perDisc)}</div>
                            <div>{formatDate(p?.date) || ''}</div>
                            <div className="status">
                                <span className={`status-badge ${p?.status === "Active" ? "active" : "inactive"}`}>
                                    {p?.status || ''}
                                </span>
                            </div>
                            <div className="actions">
                                <span className="edit" onClick={() => handleEdit(p)}>Edit</span>
                                {" | "}
                                <span className="delete" onClick={() => handleDelete(p._id)}>Delete</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" ref={modalRef}>
                        <h2>{editId ? "Edit Price" : "Add New Price"}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group" >
                                <label>Item Code</label>
                                <div className="input-with-btn">
                                    <input
                                        ref={codeRef}
                                        type="text"
                                        value={newPrice.code}
                                        onChange={(e) =>
                                            setNewPrice({ ...newPrice, code: e.target.value.trim().toUpperCase() })
                                        }
                                        onKeyDown={(e) => handleKeyNav(e, "code")}
                                        disabled={editId} // Disable code editing when updating
                                    />
                                    <button
                                        type="button"
                                        className="dropdown-btn"
                                        onClick={() =>
                                            openItemModal((code) =>
                                                setNewPrice(prev => ({ ...prev, code: code.trim().toUpperCase() }))
                                            )
                                        }
                                    >
                                        ⌄
                                    </button>
                                </div>


                            </div>

                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={matchedItem?.name || ""}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Base Price</label>
                                <input
                                    ref={baseRef}
                                    type="number"
                                    value={newPrice.basePrice}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, basePrice: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "basePrice")}
                                />
                            </div>

                            <div className="form-group">
                                <label>% Disc</label>
                                <input
                                    ref={discRef}
                                    type="number"
                                    value={newPrice.perDisc}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, perDisc: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "disc")}
                                />
                            </div>

                            <div className="form-group">
                                <label>% Tax</label>
                                <input
                                    ref={taxRef}
                                    type="number"
                                    value={newPrice.perTax}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, perTax: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "perTax")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    ref={dateRef}
                                    type="date"
                                    value={newPrice.date}
                                    onChange={(e) =>
                                        setNewPrice({ ...newPrice, date: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Net Rate</label>
                                <input
                                    type="text"
                                    value={calculateNetRate(newPrice.basePrice, newPrice.perTax, newPrice.perDisc)}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5" }}
                                />
                            </div>

                            {editId && (

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        ref={statusRef}
                                        value={newPrice.status}
                                        onChange={(e) =>
                                            setNewPrice({ ...newPrice, status: e.target.value })
                                        }
                                        onKeyDown={(e) => handleKeyNav(e, "status")}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            )}

                            <div className="modal-buttons">
                                <button
                                    ref={saveRef}
                                    type="submit"
                                    className="submit-btn"
                                    onKeyDown={(e) => handleKeyNav(e, "save")}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    );
};

export default LatestPrice;