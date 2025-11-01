import React, { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast'
import api from '../api/api';

const PriceContext = createContext();

export function PricesProvider({ children }) {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllPrices = async () => {
        try {
            setLoading(true);
            const res = await api.get('/rates/');
            setPrices(res.data);
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error fetching prices");
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
            toast.error(err.response?.data?.message || "Error fetching price");
        } finally {
            setLoading(false);
        }
    };

    const addPrice = async (payload) => {
        try {
            setLoading(true);
            const res = await api.post('/rates', payload);
            toast.success(res.data.message || "Price added sucessfully");
            await getAllPrices();
            return res;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding price");
        } finally {
            setLoading(false);
        }
    };

    const updatePrice = async (id, payload) => {
        try {
            setLoading(true);
            const res = await api.patch(`/rates/${id}`, payload, { withCredentials: true });
            toast.success(res.data.message || "Price updated sucessfully");
            await getAllPrices();
            return res;
        } catch (err) {
            toast.error(err.response.data.messsage || "Error updating price");
        } finally {
            setLoading(false);
        }
    };

    const deletePrice = async (id) => {
        try {
            setLoading(true);
            const res = await api.delete(`/rates/${id}`);
            toast.success(res.data.message || "Price deleted sucessfully");
            setPrices(prices.filter((c) => c._id !== id));
            return res;
        } catch (err) {
            toast.error(err.response.data.message || "Error deleting price");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPrices();
    }, []);

    return (
        <PriceContext.Provider value={{ prices, loading, getAllPrices, updatePrice, getPriceByID, deletePrice, addPrice }} >{children}</PriceContext.Provider>
    );

}

export const usePrice = () => useContext(PriceContext);