const LoadOut = require("../../models/transaction/LoadOut");
const StockService = require('../../services/StockCalculator.js');

exports.addLoadout = async (req, res) => {
    try {
        const { salesmanCode, date, trip, items } = req.body;

        if (!salesmanCode || !date || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadOut.findOne({ salesmanCode: salesmanCode, date: date, trip });

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
            items
        });

        res.status(200).json({ message: "loadout added sucessfully" ,success:true , allocations});

    } catch (err) {
        res.status(500).json({ message: "Error adding loadOut", error: err.message , success:false});
    }
};

exports.getLoadOut = async (req, res) => {
    try {
        const { salesmanCode, date, trip } = req.body;
        if (!salesmanCode || !date || !trip) return res.status(400).json({ message: "All fields are required" });
        const data = await LoadOut.findOne({ salesmanCode, date, trip });
        if (!data) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching loadout record", error: err.message });
    }
};

exports.getAllLoadOuts = async (req, res) => {
    try {
        const data = await LoadOut.find();
        if (!data) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reccord", error: err.message });
    }
};

exports.updateLoadOut = async (req, res) => {
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

exports.deleteLoadOut = async (req, res) => {
    try {
        const deleted = await LoadOut.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Loadout record not found" });
        res.status(200).json({ message: "LoadOut record deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting loadout", error: err.message });
    }
};




