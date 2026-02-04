import React, { useState, useEffect, useContext, createContext } from 'react';
import api from '../api/api';
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";



const SalesmanContext = createContext();

export function SalesmanProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [salesmans, setSalesmans] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllSalesmen = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/salesman`);
            setSalesmans(res.data);
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error fetching salesman", "error");
        } finally {
            setLoading(false);
        }
    };
    const getSalesmanByID = async (id) => {
        try {
            setLoading(true);
            const res = await api.get(`/salesman/${id}`);
            setSalesmans(res.data);
        } catch (err) {
            showToast(err.response?.data?.message || "Error fetching salesman", "error");
        } finally {
            setLoading(false);
        }
    };

    const addSalesman = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post("/salesman/", payload);
            showToast(res.data.message || "Salesman added successfully", "success");
            await getAllSalesmen();
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error adding salesman", "error");

            throw err;
            // console.log(err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const updateSalesman = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/salesman/${id}`, payload);
            showToast(res.data.message || "Salesman updated", "success");
            await getAllSalesmen();
        } catch (err) {
            showToast(err.response?.data?.message || "Error updating salesman", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteSalesman = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/salesman/delete/${id}`);
            showToast(res.data.message || "salesman deleted", "success");
            setSalesmans(salesmans.filter((c) => c._id !== id));
        } catch (err) {
            showToast(err.response?.data?.message || "Error deleting salesman", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        getAllSalesmen();
    }, [isAuthenticated]);

    return (
        <SalesmanContext.Provider value={{ salesmans, loading, getAllSalesmen, updateSalesman, deleteSalesman, addSalesman, getSalesmanByID }} >{children}</SalesmanContext.Provider>
    );
}

export const useSalesman = () => useContext(SalesmanContext);
