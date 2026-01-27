import Rate from '../../models/rates.js';

export const addRate = async (req, res) => {
    try {
        const { code, basePrice, perTax, date, perDisc, status } = req.body;

        if (!code || !basePrice || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const depo = req.user?.depo;
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
            perTax: perTax || 0,
            perDisc: perDisc || 0,
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


export const getLatestByDate = async (req, res) => {
    try {
        const { code, date } = req.query;

        const price = await Rate.find({
            depo:req.user?.depo,
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
export const getAllRates = async (req, res) => {
    try {
    
        const rates = await Rate.find({ depo: req.user?.depo });
        res.status(200).json(rates);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rates", error: err.message });
    }
};

// Get rate by ID
export const getRateById = async (req, res) => {
    try {
        const rate = await Rate.findOne({ _id: req.params.id, depo: req.user?.depo });
        if (!rate) return res.status(404).json({ message: "Rate not found" });
        res.status(200).json(rate);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rate", error: err.message });
    }
};

// Update rate
export const updateRate = async (req, res) => {
    try {
        const updatedRate = await Rate.findOneAndUpdate(
            { _id: req.params.id, depo: req.user?.depo },
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
export const deleteRate = async (req, res) => {
    try {
        const deletedRate = await Rate.findOneAndDelete({ _id: req.params.id, depo: req.user?.depo });
        if (!deletedRate) return res.status(404).json({ message: "Rate not found" });
        res.status(200).json({ message: "Rate deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting rate", error: err.message });
    }
};

