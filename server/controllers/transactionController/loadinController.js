const LoadIn = require('../../models/transaction/loadIn');

exports.addLoadIn = async (req, res) => {
    try {
        const { salesmanCode, date, trip, items } = req.body;

        if (!salesmanCode || !date || !trip || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadIn.findOne({ salesmanCode, date, trip });

        if (existing) return res.status(400).json({ message: `Loadin record of ${salesmanCode} at ${date} exists for ${trip}` });

        await LoadIn.create({
            salesmanCode: salesmanCode,
            date: Date,
            trip,
            items
        });

        res.status(200).json({ message: "loadin added sucessfully" });

    } catch (err) {
        res.status(500).json({ message: "Error adding loadin", error: err.message });
    }
};



exports.getAllLoadIn = async (req, res) => {
    try {
        const data = await LoadIn.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching loadin record", error: err.message });
    }
};

// exports.getLoadInById = async (req, res) => {
//     try {
//         const data = await LoadIn.findById(req.params.id);
//         if (!data) return res.status(404).json({ message: "Record not found" });
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching reccord", error: err.message });
//     }
// };

exports.getLoadIn = async (req, res) => {
    try {
        const { salesmanCode, date } = req.body;
        const data = await LoadIn.findOne({ salesmanCode, date });
        if (!data) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching loadin record", error: err.message });
    }
};

exports.updateLoadIn = async (req, res) => {
    try {
        const updated = await LoadIn.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Loadin record not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating LoadIn", error: err.message });
    }
};

exports.deleteLoadIn = async (req, res) => {
    try {
        const deleted = await LoadIn.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "LoadIn record not found" });
        res.status(200).json({ message: "LoadIn record deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting loadin", error: err.message });
    }
};




