const Rate = require('../../models/rates.js');
const Depo = require('../../models/depoModal.js');

exports.addRate = async (req, res) => {
    try {
        const { code, basePrice, perTax, date, perDisc, depo, status } = req.body;

        if (!code || !basePrice || !perTax || !date || !perDisc || !depo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const existing = await Rate.findOne({
            itemCode: code,
            depo,
            date: new Date(date).toISOString()
        });

        if (existing) {
            return res.status(400).json({
                message: "Price of this item already exists at same date"
            });
        }

        // NEW: Mark all existing prices for this item as Inactive
        await Rate.updateMany(
            { itemCode: code, depo: depo },
            { $set: { status: "Inactive" } } // Set them to Inactive
        );

        // Create new price as Active
        const created = await Rate.create({
            itemCode: code,
            basePrice,
            perTax,
            perDisc,
            date,
            depo,
            status: "Active", // Always Active for new prices
        });

        return res.status(201).json({
            message: "Rate added successfully and old prices marked inactive",
            rate: created
        });

    } catch (err) {
        console.log("Error adding rate:", err.message);
        res.status(500).json({
            message: "Error adding rate",
            error: err.message
        });
    }
};


exports.getLatestByDate = async (req, res) => {
    try {
        const { code, date, depo } = req.query;

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const price = await Rate.find({
            depo,
            code,
            effectiveDate: { $lte: new Date(date) }
        })
            .sort({ effectiveDate: -1 })
            .limit(1);

        res.status(200).json(price[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching price", error: err.message });
    }
}


// Get all rates
exports.getAllRates = async (req, res) => {
    try {
        const { depo } = req.body;
        if (!depo) return res.status(400).json({ message: "Depo is required" });

        if (!mongoose.Types.ObjectId.isValid(depo)) {
            return res.status(400).json({ message: "Invalid depo ID" });
        }

        const depoExists = await Depo.findById(depo);
        if (!depoExists) {
            return res.status(400).json({ message: "Depo not found" });
        }

        const rates = await Rate.find({ depo });
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

