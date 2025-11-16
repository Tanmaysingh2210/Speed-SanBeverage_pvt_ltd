import React, { useState, useEffect } from 'react';
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
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="purchase-button-container">
                <button 
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