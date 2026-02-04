import React, { createContext, useContext, useState, useEffect } from "react";
import api from '../api/api';
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const PriceContext = createContext();

export function PricesProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllPrices = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/rates`);
            setPrices(res.data);
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error fetching prices", "error");
        } finally {
            setLoading(false);
        }
    };

    const getPriceByDate = async (code, date) => {
        try {
            setLoading(true);
            const res = await api.get(`/rates/price`, {
                params: { code, date }
            });
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Error fetching price";
        } finally {
            setLoading(false);
        }
    };

    const getPriceByID = async (id) => {
        try {
            setLoading(true);
            const res = await api.get(`/rates/${id}`);
            setPrices(res.data);
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error fetching price", "error");
        } finally {
            setLoading(false);
        }
    };

    const addPrice = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/rates', payload);
            showToast(res.data.message || "Price added sucessfully", "success");
            await getAllPrices();
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error adding price", "error");
        } finally {
            setLoading(false);
        }
    };

    const updatePrice = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/rates/${id}`, payload, { withCredentials: true });
            showToast(res.data.message || "Price updated sucessfully", "success");
            await getAllPrices();
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error updating price", "error");
        } finally {
            setLoading(false);
        }
    };

    const deletePrice = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/rates/${id}`);
            showToast(res.data.message || "Price deleted sucessfully", "success");
            setPrices(prices.filter((c) => c._id !== id));
            return res;
        } catch (err) {
            showToast(err.response?.data?.message || "Error deleting price", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        getAllPrices();
    }, [isAuthenticated]);

    return (
        <PriceContext.Provider value={{ prices, loading, getAllPrices, updatePrice, getPriceByDate, getPriceByID, deletePrice, addPrice }} >{children}</PriceContext.Provider>
    );

}

export const usePrice = () => useContext(PriceContext);