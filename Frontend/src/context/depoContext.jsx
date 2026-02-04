import React, { createContext, useContext, useState, useEffect } from "react";
import api from '../api/api';
import { useToast } from "./ToastContext";

const DepoContext = createContext();

export function DepoProvider({ children }) {
    const [depos, setDepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const getAllDepo = async () => {
        try {
            setLoading(true);
            const res = await api.get('/depo/');
            setDepos(res.data);
            return res;
        }
        catch (err) {
            showToast(err.response?.data?.message || "Error fetching depos", "error");

        }
        finally {
            setLoading(false);
        }
    };

    const addDepo = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/depo/', payload);
            await getAllDepo();
            return res;
        }
        catch (err) {
            showToast(err.response?.data?.message || "Error adding depos", "error");
        }
        finally {
            setLoading(false);
        }
    };

    const updateDepo = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/depo/${id}`, payload);
            showToast(res.data.message || "depo update successfully", "success");
            setDepos((prev) =>
                prev.map((d) => (d._id === id ? res.data : d))
            );
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error updating depo", "error");
        }
        finally {
            setLoading(false);
        }
    };

    const deleteDepo = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/depo/delete/${id}`);
            showToast(res.data.message || "depo deleted successfully", "success");
            setDepos(prev => prev.filter(c => c._id !== id));
            return res;
        }
        catch (err) {
            showToast(err.response.data.message || "Error deleting depo", "error");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchDepos = async () => {
            await getAllDepo();
        };
        fetchDepos();
    }, []);

    return (
        <DepoContext.Provider value={{ loading, depos, addDepo, deleteDepo, updateDepo, getAllDepo }}>{children}</DepoContext.Provider>
    );
}

export const useDepo = () => useContext(DepoContext);