const Rate=require('../../models/rates.js')


// Create a new rate
exports.addRate = async (req, res) => {
    try {
        const { itemCode, basePrice, perTax, Date } = req.body;

        if (!itemCode || !basePrice || !perTax || !Date) {
            return res.status(400).json({ message: "All fields are required (itemCode, basePrice, perTax, Date)" });
        }

        const existing = await Rate.findOne({ itemCode });
        if (existing) {
            return res.status(400).json({ message: "Rate for this itemCode already exists" });
        }

        await Rate.create({ itemCode, basePrice, perTax, Date });
        res.status(200).json({ message: "Rate added successfully" });

    } catch (err) {
        console.log("Error adding rate:", err.message);
        res.status(500).json({ message: "Error adding rate", error: err.message });
    }
};

// Get all rates
exports.getAllRates = async (req, res) => {
    try {
        const rates = await Rate.find();
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rates", error: err.message });
    }
};

// Get rate by ID
exports.getRateById = async (req, res) => {
    try {
        const rate = await Rate.findById(req.params.id);
        if (!rate) return res.status(404).json({ message: "Rate not found" });
        res.status(200).json(rate);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rate", error: err.message });
    }
};

// Update rate
exports.updateRate = async (req, res) => {
    try {
        const updatedRate = await Rate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRate) return res.status(404).json({ message: "Rate not found" });
        res.status(200).json({ message: "Rate updated successfully", updatedRate });
    } catch (err) {
        res.status(500).json({ message: "Error updating rate", error: err.message });
    }
};

// Delete rate
exports.deleteRate = async (req, res) => {
    try {
        const deletedRate = await Rate.findByIdAndDelete(req.params.id);
        if (!deletedRate) return res.status(404).json({ message: "Rate not found" });
        res.status(200).json({ message: "Rate deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting rate", error: err.message });
    }
};

