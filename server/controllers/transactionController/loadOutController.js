import LoadOut from "../../models/transaction/LoadOut.js";
import StockService from '../../services/StockCalculator.js';


export const addLoadout = async (req, res) => {
    try {
        const { salesmanCode, date, trip, items } = req.body;

        if (!salesmanCode || !date || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "All fields are required" });

        const depo = req.user?.depo;

        const existing = await LoadOut.findOne({ salesmanCode: salesmanCode, date: date, trip, depo });

        if (existing) return res.status(400).json({ message: `Loadout record exists` });

        await StockService.cleanupExpiredItems(depo);
        const allocations = await StockService.processLoadout(items, depo);
        const hasShortfall = allocations.some(a => a.shortfall > 0);

        if (hasShortfall) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock for some items',
                allocations
            });
        }

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
        const { salesmanCode, date, trip } = req.body;
        if (!salesmanCode || !date || !trip) return res.status(400).json({ message: "All fields are required" });

        const data = await LoadOut.findOne({ salesmanCode, date, trip, depo: req.user?.depo });
        if (!data) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching loadout record", error: err.message });
    }
};

export const getAllLoadOuts = async (req, res) => {
    try {
        const data = await LoadOut.find({ depo: req.user?.depo });
        if (!data) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reccord", error: err.message });
    }
};

export const updateLoadOut = async (req, res) => {
    try {
        const updated = await LoadOut.findOneAndUpdate(
            { _id: req.params.id, depo: req.user?.depo },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Loadout not found" });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating loadout", error: err.message });
    }
};


export const deleteLoadOut = async (req, res) => {
    try {
        const deleted = await LoadOut.findOneAndDelete({ _id: req.params.id, depo: req.user?.depo });
        if (!deleted) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json({ message: "LoadOut record deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting loadout", error: err.message });
    }
};




