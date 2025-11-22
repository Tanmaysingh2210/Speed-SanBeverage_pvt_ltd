import React, { useContext, createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api';


const TransationContext = createContext();

export function TransactionProvider({ children }) {
    const [loadout, setLoadout] = useState([]);
    const [loadin, setLoadin] = useState([]);
    const [cashCredit, setCashCredit] = useState([]);
    const [loading, setLoading] = useState(false);

    const addLoadout = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadout/add', payload);
            toast.success(res.data.message || "loadout added successfully");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding loadout");
            throw err;
        } finally {
            setLoading(false);
        }

    };

    const getLoadout = async (payload) => { // to gte one loadout record 
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadout', payload);
            setLoadout(res.data);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error getting loadout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateLoadout = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/transaction/loadout/update/${id}`, payload);
            toast.success(res.data.message || "loadout updated successfully");
            // await getAllLoadout();
            return res.data;

        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating loadout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteLoadout = async (id) => {

        try {
            setLoading(true);
            const res = await api.delete(`/transaction/loadout/delete/${id}`);
            toast.success(res.data.message || "loadout deleted successfully");
            // await getAllLoadout();
            return res.data;

        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting loadout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllLoadout = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/transaction/loadout`);
            setLoadout(res.data);
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addLoadIn = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadin/add', payload);
            toast.success(res.data.message || "loadin added successfully");
            // await getAllLoadin();
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding loadin");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getLoadIn = async (payload) => { //to get one loadin 
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadin', payload);
            setLoadin(res.data);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding loadin");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateLoadIn = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/transaction/loadin/update/${id}`, payload);
            toast.success(res.data.message || "loadin updated successfully");
            // await getAllLoadin();
            return res.data;

        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating loadin");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteLoadin = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/transaction/loadin/delete/${id}`);
            toast.success(res.data.message || "loadin deleted successfully");
            // await getAllLoadin();
            return res.data;

        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting loadin");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllLoadin = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/transaction/loadin`);
            setLoadin(res.data);
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addCash_credit = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post(`/transaction/cashcredit/add`, payload);
            toast.success(res.data.message || "cash/credit added sucessfully");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding cash/credit");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCash_credit = async (payload) => { //to get one cash credit 
        try {
            setLoading(true);
            const res = await api.post(`/transaction/cashcredit/getone`, payload);
            setCashCredit(res.data);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching cash/credit");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCash_credit = async (payload, id) => {
        try {
            setLoading(true);
            const res = await api.patch(`/transaction/cashcredit/update/${id}`, payload);
            toast.success(res.data.message || "cash/credit updated sucessfully");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating cash/credit");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCash_credit = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/transaction/cashcredit/delete/${id}`);
            toast.success(res.data.message || "cash/credit deleted sucessfully");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting cash/credit");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getSettlement = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/transaction/settlement', payload);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching settlement");
            throw err;
        } finally {
            setLoading(false);
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

    return (
        <TransationContext.Provider value={{
            loadout,
            loading,
            getAllLoadout,
            updateLoadout,
            deleteLoadout,
            addLoadout,
            getLoadout,

            loadin,
            addLoadIn,
            getLoadIn,
            updateLoadIn,
            deleteLoadin,
            getAllLoadin,

            cashCredit,
            addCash_credit,
            getCash_credit,
            updateCash_credit,
            deleteCash_credit,

            getSettlement,

            FormatDate

        }} >
            {children}
        </TransationContext.Provider>
    );

}

export const useTransaction = () => useContext(TransationContext);