import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';


const PurchaseContext = createContext();

// Provider Component
export const PurchaseProvider = ({ children }) => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    let API_URL;
    if (user && user.depo) {
         API_URL = `http://localhost:3000/purchase?depo=${user.depo}`;
    }


    // CREATE - Add new purchase
    const createPurchase = async (purchaseData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData)
            });

            if (!response.ok) {
                throw new Error('Failed to create purchase');
            }

            const data = await response.json();

            // Add new purchase to state
            setPurchases([data.data, ...purchases]);

            setLoading(false);
            return { success: true, data: data.data };

        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // READ - Get all purchases
    const getAllPurchases = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch purchases');
            }

            const data = await response.json();
            setPurchases(data.data);

            setLoading(false);
            return { success: true, data: data.data };

        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // READ - Get single purchase by ID
    const getPurchaseById = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
                throw new Error('Purchase not found');
            }

            const data = await response.json();

            setLoading(false);
            return { success: true, data: data.data };

        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // UPDATE - Update purchase
    const updatePurchase = async (id, updatedData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Failed to update purchase');
            }

            const data = await response.json();

            // Update purchase in state
            setPurchases(purchases.map(p =>
                p._id === id ? data.data : p
            ));

            setLoading(false);
            return { success: true, data: data.data };

        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // DELETE - Delete purchase
    const deletePurchase = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete purchase');
            }

            // Remove purchase from state
            setPurchases(purchases.filter(p => p._id !== id));

            setLoading(false);
            return { success: true };

        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // Calculate Net Amount (Helper function)
    const calculateNetAmount = (value, disc, percentVat) => {
        const total = parseFloat(value || 0) - parseFloat(disc || 0);
        const vat = (total * parseFloat(percentVat || 0)) / 100;
        const netAmt = total + vat;
        return netAmt.toFixed(2);
    };

    const value = {
        purchases,
        loading,
        error,
        createPurchase,
        getAllPurchases,
        getPurchaseById,
        updatePurchase,
        deletePurchase,
        calculateNetAmount
    };

    return (
        <PurchaseContext.Provider value={value}>
            {children}
        </PurchaseContext.Provider>
    );
};


export const usePurchase = () => useContext(PurchaseContext);