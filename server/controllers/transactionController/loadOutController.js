import LoadOut from "../../models/transaction/LoadOut.js";
import StockService from '../../services/StockCalculator.js';
import Depo from '../../models/depoModal.js';
import mongoose from 'mongoose';

export const addLoadout = async (req, res) => {
    try {
        const { salesmanCode, date, trip, items, depo } = req.body;

        if (!salesmanCode || !date || !Array.isArray(items) || items.length === 0 || !depo) return res.status(400).json({ message: "All fields are required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }
        const existing = await LoadOut.findOne({ salesmanCode: salesmanCode, date: date, trip, depo });

        if (existing) return res.status(400).json({ message: `Loadout record exists` });


        // Clean up expired items first
        await StockService.cleanupExpiredItems();
        // Process loadout with FIFO logic
        const allocations = await StockService.processLoadout(items);
        // Check for shortfalls
        const hasShortfall = allocations.some(a => a.shortfall > 0);

        if (hasShortfall) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock for some items',
                allocations
            });
        }

        // Create loadout record
        await LoadOut.create({
            salesmanCode: salesmanCode,
            date: date,
            trip,
            items,
            depo
        });

        res.status(200).json({ message: "loadout added sucessfully", success: true, allocations });

    } catch (err) {
        res.status(500).json({ message: "Error adding loadOut", error: err.message, success: false });
    }
};

export const getLoadOut = async (req, res) => {
    try {
        const { salesmanCode, date, trip, depo } = req.body;
        if (!salesmanCode || !date || !trip || !depo) return res.status(400).json({ message: "All fields are required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }
        const data = await LoadOut.findOne({ salesmanCode, date, trip, depo });
        if (!data) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching loadout record", error: err.message });
    }
};

export const getAllLoadOuts = async (req, res) => {
    try {
        const data = await LoadOut.find();
        if (!data) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reccord", error: err.message });
    }
};

export const updateLoadOut = async (req, res) => {
    try {
        const updated = await LoadOut.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating LoadOut", error: err.message });
    }
};

export const deleteLoadOut = async (req, res) => {
    try {
        const deleted = await LoadOut.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json({ message: "LoadOut record deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting loadout", error: err.message });
    }
};




