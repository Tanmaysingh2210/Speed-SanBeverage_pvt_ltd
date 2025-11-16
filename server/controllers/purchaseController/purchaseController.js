
const Purchase =require('../../models/purchase/purchaseEntry.js');

// CREATE - New Purchase Entry
exports.createPurchase = async (req, res) => {
    try {
        const {
            party,
            slno,
            date,
            gra,
            nameAddress,
            vehicleNo,
            vnoDt,
            vno,
            bill,
            erc,
            frc,
            value,
            disc,
            percentVat,
            purchaseAgst,
            formIssue
        } = req.body;

        // Validation
        if (!party || !slno || !date || !gra) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        // Create new purchase
        const newPurchase = new Purchase({
            party,
            slno,
            date,
            gra,
            nameAddress,
            vehicleNo,
            vnoDt,
            vno,
            bill,
            erc,
            frc,
            value,
            disc: disc || 0,
            percentVat,
            purchaseAgst,
            formIssue
        });

        // Save to database
        const savedPurchase = await newPurchase.save();

        res.status(201).json({
            message: 'Purchase entry created successfully',
            data: savedPurchase
        });

    } catch (error) {
        console.error('Error creating purchase:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// READ - Get All Purchases
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Purchases fetched successfully',
            count: purchases.length,
            data: purchases
        });

    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// READ - Get Single Purchase by ID
exports.getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return res.status(404).json({ 
                message: 'Purchase not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase fetched successfully',
            data: purchase
        });

    } catch (error) {
        console.error('Error fetching purchase:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// UPDATE - Update Purchase
exports.updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPurchase) {
            return res.status(404).json({ 
                message: 'Purchase not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase updated successfully',
            data: updatedPurchase
        });

    } catch (error) {
        console.error('Error updating purchase:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// DELETE - Delete Purchase
exports.deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPurchase = await Purchase.findByIdAndDelete(id);

        if (!deletedPurchase) {
            return res.status(404).json({ 
                message: 'Purchase not found' 
            });
        }

        res.status(200).json({
            message: 'Purchase deleted successfully',
            data: deletedPurchase
        });

    } catch (error) {
        console.error('Error deleting purchase:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};