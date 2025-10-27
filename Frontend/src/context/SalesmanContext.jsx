import React, { useState, useEffect, useContext, createContext } from 'react';


const SalesmanContext = createContext();

export function SalesmanProvider({ children }) {
    const [salesmans, setSalesmans] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllSalesmans = async () => {
        try {
            setLoading(true);
            const res = await api.get("/salesman/");
            setSalesmans(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching salesman");
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
            toast.error(err.response?.data?.message || "Error fetching salesman");
        } finally {
            setLoading(false);
        }
    };

    const addSalesman = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post("/salesman/", payload);
            toast.success(res.data.message || "Salesman added successfully");
            getAllSalesmans();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding salesman");
        } finally {
            setLoading(false);
        }
    };

    const updateSalesman = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/salesman/${id}`, payload);
            toast.success(res.data.message || "Salesman updated");
            getAllSalesmans();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating salesman");
        } finally {
            setLoading(false);
        }
    };

    const deleteSalesman = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/salesman/delete/${id}`);
            toast.success(res.data.message || "salesman deleted");
            setSalesmans(salesmans.filter((c) => c._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting salesman");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllSalesmans();
    }, []);


    return (
        <SalesmanContext.Provider value={{ salesmans, getAllSalesmans, updateSalesman, deleteSalesman, addSalesman, getSalesmanByID }} >{children}</SalesmanContext.Provider>
    );
}

export const useSalesman = () => useContext(SalesmanContext);
