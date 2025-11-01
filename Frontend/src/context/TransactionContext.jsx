import React, { useContext, createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api';


const TransationContext = createContext();

export function TransactionProvider({ children }) {
    const [loadout, setLoadout] = useState([]);
    const [loading, setLoading] = useState(false);



    const addLoadout = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadout/add/', payload);
            toast.success(res.data.message || "loadout added sucessfully");
            await getAllLoadout();
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding loadout");
            throw err;
        } finally {
            setLoading(false);
        }

    };

    const getLoadout = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/transaction/loadout/', payload);
            toast.success(res.data.message || "loadout fetched sucessfully");
            setLoadout(res);
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding loadout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateLoadout = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/transaction/loadout/update/:${id}`, payload)
            toast.success(res.data.message || "loadout updated sucessfully");
            await getAllLoadout();
            return res;

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
            const res = await api.delete(`/transaction/loadout/delete/:${id}`);
            toast.success(res.data.message || "loadout deleted sucessfully");
            await getAllLoadout();
            return res;

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
            const res = await api.get(`/transaction/loadout/`);
            toast.success(res.data.message || "loadouts fetched sucessfully");
            setLoadout(res);
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching loadout");
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getAllLoadout();
    }, []);

    return (
        <TransationContext.Provider value={{
            loadout,
            loading,
            getAllLoadout,
            updateLoadout,
            deleteLoadout,
            addLoadout,
            getLoadout,
        }} >
            {children}
        </TransationContext.Provider>
    );

}

export const useTransaction = () => useContext(TransationContext);