const PurchaseItemwise = require('../../models/purchase/PurchaseItemwise.js');

// CREATE - New Purchase Itemwise Entry
exports.createPurchaseItemwise = async (req, res) => {
    try {
        const { date, items } = req.body;

        // Validation
        if (!date || !items || items.length === 0) {
            return res.status(400).json({ 
                message: 'Please provide date and items' 
            });
        }

        // Validate each item
        for (let item of items) {
            if (!item.itemCode || !item.qty || !item.expiryDate) {
                return res.status(400).json({ 
                    message: 'Each item must have itemCode, qty, and expiryDate' 
                });
            }
        }

        // Create new purchase itemwise
        const newPurchase = new PurchaseItemwise({
            date,
            items
        });

        // Save to database
        const savedPurchase = await newPurchase.save();

        res.status(201).json({
            message: 'Purchase itemwise created successfully',
            data: savedPurchase
        });

    } catch (error) {
        console.error('Error creating purchase itemwise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// READ - Get All Purchase Itemwise
exports.getAllPurchaseItemwise = async (req, res) => {
    try {
        const purchases = await PurchaseItemwise.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Purchase itemwise fetched successfully',
            count: purchases.length,
            data: purchases
        });

    } catch (error) {
        console.error('Error fetching purchase itemwise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// READ - Get Single Purchase Itemwise by ID
exports.getPurchaseItemwiseById = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await PurchaseItemwise.findById(id);

        if (!purchase) {
            return res.status(404).json({ 
                message: 'Purchase itemwise not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase itemwise fetched successfully',
            data: purchase
        });

    } catch (error) {
        console.error('Error fetching purchase itemwise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// UPDATE - Update Purchase Itemwise
exports.updatePurchaseItemwise = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedPurchase = await PurchaseItemwise.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPurchase) {
            return res.status(404).json({ 
                message: 'Purchase itemwise not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase itemwise updated successfully',
            data: updatedPurchase
        });

    } catch (error) {
        console.error('Error updating purchase itemwise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// DELETE - Delete Purchase Itemwise
exports.deletePurchaseItemwise = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPurchase = await PurchaseItemwise.findByIdAndDelete(id);

        if (!deletedPurchase) {
            return res.status(404).json({ 
                message: 'Purchase itemwise not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase itemwise deleted successfully',
            data: deletedPurchase
        });

    } catch (error) {
        console.error('Error deleting purchase itemwise:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};