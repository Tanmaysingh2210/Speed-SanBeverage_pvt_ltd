import React, { useState, useEffect , useRef } from 'react';
import "../purchase/purchase.css"; // New separate CSS file
import { usePurchase } from '../../context/PurchaseContext.jsx';

const PurchaseEntry = () => {
    const { createPurchase, calculateNetAmount, loading } = usePurchase();

    const [formData, setFormData] = useState({
        party: '',
        slno: '',
        date: '',
        gra: '',
        nameAddress: '',
        vehicleNo: '',
        vnoDt: '',
        vno: '',
        bill: '',
        erc: '',
        frc: '',
        value: '',
        disc: '',
        percentVat: '',
        purchaseAgst: '',
        formIssue: ''
    });

    const [netAmt, setNetAmt] = useState(0);

        const modalPartyRef = useRef(null);
        const modalSlnoRef = useRef(null);
        const modalDateRef = useRef(null);
        const modalGraRef = useRef(null);
        const modalNameaddRef = useRef(null);
        const modalVehiclenoRef = useRef(null);
        const modalVnodtRef = useRef(null);
        const modalVnoRef = useRef(null);
        const modalBillRef = useRef(null);
        const modalErcRef = useRef(null);
        const modalFrcRef = useRef(null);
        const modalValueRef = useRef(null);
        const modalDiscRef = useRef(null);
        const modalPervatRef = useRef(null);
        const modalPurchaseagstRef = useRef(null);
        const modalFormissueRef = useRef(null);
        const SubmitRef = useRef(null);

    // Calculate Net Amount
    useEffect(() => {
        const calculated = calculateNetAmount(
            formData.value, 
            formData.disc, 
            formData.percentVat
        );
        setNetAmt(calculated);
    }, [formData.value, formData.disc, formData.percentVat]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await createPurchase(formData);

        if (result.success) {
            // alert('Purchase entry created successfully!');
            // Reset form
            setFormData({
                party: '',
                slno: '',
                date: '',
                gra: '',
                nameAddress: '',
                vehicleNo: '',
                vnoDt: '',
                vno: '',
                bill: '',
                erc: '',
                frc: '',
                value: '',
                disc: '',
                percentVat: '',
                purchaseAgst: '',
                formIssue: ''
            });
            setNetAmt(0);
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const handleKeyNav = (e, currentField) => {
        if (["ArrowRight", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();

            if (e.key === "Enter" && currentField === "submit") {
                SubmitRef.current?.click();
                return;
            }

            switch (currentField) {
                case "party":
                    modalSlnoRef.current?.focus();
                    break;
                case "slno":
                    modalDateRef.current?.focus();
                    break;
                case "date":
                    modalGraRef.current?.focus();
                    break;
                case "gra":
                    modalNameaddRef.current?.focus();
                    break;
                case "nameandaddress":
                    modalVehiclenoRef.current?.focus();
                    break;
                case "vehicleno":
                    modalBillRef.current?.focus();
                    break;
                case "bill":
                    modalVnodtRef.current?.focus();
                    break;
                case "vnodt":
                    modalErcRef.current?.focus();
                    break;
                case "erc":
                    modalVnoRef.current?.focus();
                    break;
                case "vno":
                    modalFrcRef.current?.focus();
                    break;
                case "frc":
                    modalValueRef.current?.focus();
                    break;
                case "value":
                    modalPervatRef.current?.focus();
                    break;
                case "pervat":
                    modalDiscRef.current?.focus();
                    break;
                case "disc":
                    modalPurchaseagstRef.current?.focus();
                    break;
                case "purchaseagst":
                    modalFormissueRef.current?.focus();
                    break;
                case "formissue":
                    if (e.key === "Enter") {
                        SubmitRef.current?.click();
                    } else {
                        SubmitRef.current?.focus();
                    }
                    break;
                default:
                    break;
            }

        } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            switch (currentField) {
                case "slno":
                    modalPartyRef.current?.focus();
                    break;
                case "date":
                    modalSlnoRef.current?.focus();
                    break;
                case "gra":
                    modalDateRef.current?.focus();
                    break;
                case "nameandaddress":
                    modalGraRef.current?.focus();
                    break;
                case "vehicleno":
                    modalNameaddRef.current?.focus();
                    break;
                case "bill":
                    modalVehiclenoRef.current?.focus();
                    break;
                case "vnodt":
                    modalBillRef.current?.focus();
                    break;
                case "erc":
                    modalVnodtRef.current?.focus();
                    break;
                case "vno":
                    modalErcRef.current?.focus();
                    break;
                case "frc":
                    modalVnoRef.current?.focus();
                    break;
                case "value":
                    modalFrcRef.current?.focus();
                    break;
                case "pervat":
                    modalValueRef.current?.focus();
                    break;
                case "disc":
                    modalPervatRef.current?.focus();
                    break;
                case "purchaseagst":
                    modalDiscRef.current?.focus();
                    break;
                case "formissue":
                    modalPurchaseagstRef.current?.focus();
                    break;
                case "submit":
                    modalFormissueRef.current?.focus();
                    break;
            }
        }
    }

    return (
        <div className="purchase-entry-wrapper">
            <div className="purchase-entry-container">
                <div className="purchase-entry-top">
                    {/* Left Section */}
                    <div className="purchase-entry-left-section">
                        <div className="purchase-form-group">
                            <label>Party</label>
                            <input
                                type="text"
                                name="party"
                                value={formData.party}
                                onChange={handleChange}
                                placeholder="enter party"
                                ref={modalPartyRef}
                                    onKeyDown={(e) => handleKeyNav(e, "party")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>Slno.</label>
                            <input
                                type="number"
                                name="slno"
                                value={formData.slno}
                                onChange={handleChange}
                                placeholder="enter slno."
                               ref={modalSlnoRef}
                                    onKeyDown={(e) => handleKeyNav(e, "slno")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                data-placeholder="dd/mm/yyyy"
                               ref={modalDateRef}
                                    onKeyDown={(e) => handleKeyNav(e, "date")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>GRA</label>
                            <input
                                type="number"
                                name="gra"
                                value={formData.gra}
                                onChange={handleChange}
                                placeholder="Enter GRA no."
                                ref={modalGraRef}
                                    onKeyDown={(e) => handleKeyNav(e, "gra")}
                            />
                        </div>
                    </div>

                    <div className="purchase-entry-right-section">
                        <div className="purchase-entry-row purchase-entry-full-width">
                            <div className="purchase-form-group">
                                <label>Name & Address</label>
                                <input
                                    type="text"
                                    name="nameAddress"
                                    value={formData.nameAddress}
                                    onChange={handleChange}
                                    placeholder="Enter Name and Address"
                                    ref={modalNameaddRef}
                                    onKeyDown={(e) => handleKeyNav(e, "nameandaddress")}
                                />
                            </div>
                        </div>
                        
                        <div className="purchase-entry-row">
                            <div className="purchase-form-group">
                                <label>Vehicle no.</label>
                                <input
                                    type="text"
                                    name="vehicleNo"
                                    value={formData.vehicleNo}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle no."
                                    ref={modalVehiclenoRef}
                                    onKeyDown={(e) => handleKeyNav(e, "vehicleno")}
                                />
                            </div>

                            <div className="purchase-form-group">
                                <label>VNO DT.</label>
                                <input
                                    type="date"
                                    name="vnoDt"
                                    value={formData.vnoDt}
                                    onChange={handleChange}
                                    placeholder="dd/mm/yyyy"
                                    ref={modalVnodtRef}
                                    onKeyDown={(e) => handleKeyNav(e, "vnodt")}
                                />
                            </div>

                            <div className="purchase-form-group">
                                <label>VNO.</label>
                                <input
                                    type="text"
                                    name="vno"
                                    value={formData.vno}
                                    onChange={handleChange}
                                    placeholder="Enter"
                                    ref={modalVnoRef}
                                    onKeyDown={(e) => handleKeyNav(e, "vno")}
                                />
                            </div>
                        </div>

                        <div className="purchase-entry-row">
                            <div className="purchase-form-group">
                                <label>BILL</label>
                                <input
                                    type="text"
                                    name="bill"
                                    value={formData.bill}
                                    onChange={handleChange}
                                    placeholder="Enter"
                                    ref={modalBillRef}
                                    onKeyDown={(e) => handleKeyNav(e, "bill")}
                                />
                            </div>

                            <div className="purchase-form-group">
                                <label>ERC</label>
                                <input
                                    type="text"
                                    name="erc"
                                    value={formData.erc}
                                    onChange={handleChange}
                                    placeholder="Enter"
                                    ref={modalErcRef}
                                    onKeyDown={(e) => handleKeyNav(e, "erc")}
                                />
                            </div>

                            <div className="purchase-form-group">
                                <label>FRC</label>
                                <input
                                    type="text"
                                    name="frc"
                                    value={formData.frc}
                                    onChange={handleChange}
                                    placeholder="Enter"
                                    ref={modalFrcRef}
                                    onKeyDown={(e) => handleKeyNav(e, "frc")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="purchase-entry-bottom">
                    <div className="purchase-entry-row">
                        <div className="purchase-form-group">
                            <label>Value</label>
                            <input
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                placeholder="Enter"
                                ref={modalValueRef}
                                    onKeyDown={(e) => handleKeyNav(e, "value")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>DISC</label>
                            <input
                                type="number"
                                name="disc"
                                value={formData.disc}
                                onChange={handleChange}
                                placeholder="Enter"
                                ref={modalDiscRef}
                                    onKeyDown={(e) => handleKeyNav(e, "disc")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>TOTAL</label>
                            <input
                                type="text"
                                value={(parseFloat(formData.value || 0) - parseFloat(formData.disc || 0)).toFixed(2)}
                                placeholder="Auto"
                                readOnly
                            />
                        </div>
                    </div>
                    
                    <div className="purchase-entry-row">
                        <div className="purchase-form-group">
                            <label>%VAT</label>
                            <input
                                type="number"
                                name="percentVat"
                                value={formData.percentVat}
                                onChange={handleChange}
                                placeholder="Enter"
                                ref={modalPervatRef}
                                    onKeyDown={(e) => handleKeyNav(e, "pervat")}
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>VAT</label>
                            <input
                                type="text"
                                value={(((parseFloat(formData.value || 0) - parseFloat(formData.disc || 0)) * parseFloat(formData.percentVat || 0)) / 100).toFixed(2)}
                                placeholder="Auto"
                                readOnly
                            />
                        </div>

                        <div className="purchase-form-group">
                            <label>NETAMT</label>
                            <input
                                type="text"
                                value={netAmt}
                                placeholder="Auto"
                                readOnly
                            />
                        </div>
                    </div>
                    
                    <div className="purchase-entry-row">
                        <div className="purchase-form-group purchase-form-group-half">
                            <label>PURCHASE AGST</label>
                            <input
                                type="number"
                                name="purchaseAgst"
                                value={formData.purchaseAgst}
                                onChange={handleChange}
                                placeholder="Enter"
                                ref={modalPurchaseagstRef}
                                    onKeyDown={(e) => handleKeyNav(e, "purchaseagst")}
                            />
                        </div>

                        <div className="purchase-form-group purchase-form-group-half">
                            <label>Form Issue</label>
                            <input
                                type="text"
                                name="formIssue"
                                value={formData.formIssue}
                                onChange={handleChange}
                                placeholder="Enter"
                                ref={modalFormissueRef}
                                    onKeyDown={(e) => handleKeyNav(e, "formissue")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="purchase-button-container">
                <button 
                    ref={SubmitRef}
                    onKeyDown={(e) => handleKeyNav(e, "submit")}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="purchase-submit-button"
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default PurchaseEntry;