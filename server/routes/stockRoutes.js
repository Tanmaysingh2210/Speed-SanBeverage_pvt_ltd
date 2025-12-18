const express = require('express');
const router = express.Router();
const LoadOut = require('../models/transaction/LoadOut.js');
const PurchaseItemwise = require('../models/purchase/PurchaseItemwise.js');
const StockService = require('../services/StockCalculator.js');

router.get('/', async (req, res) => {
    try {
        await StockService.cleanupExpiredItems();

        const stock = await StockService.getCurrentStock();

        res.json({
            success: true,
            data: stock,
            timestamp: new Date()
        });


    } catch (err) {
        console.error('Error fetching stock:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock',
            error: err.message
        });
    }
});


router.get('/expiring', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const expiringItems = await StockService.getExpiringItems(days);

        res.json({
            success: true,
            data: expiringItems,
            threshold: days
        });
    } catch (err) {
        console.error('Error fetching expiring items:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expiring items',
            error: err.message
        });
    }
});



// Manual cleanup endpoint
router.post('/cleanup', async (req, res) => {
    try {
        const result = await StockService.cleanupExpiredItems();

        res.json({
            success: true,
            message: 'Cleanup completed',
            ...result
        });
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({
            success: false,
            message: 'Cleanup failed',
            error: error.message
        });
    }
});


// Get stock for specific item
router.get('/:itemCode', async (req, res) => {
    try {
        await StockService.cleanupExpiredItems();

        const allStock = await StockService.getCurrentStock();
        const itemStock = allStock.find(s => s.itemCode === req.params.itemCode);

        if (!itemStock) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in stock'
            });
        }

        res.json({
            success: true,
            data: itemStock
        });
    } catch (error) {
        console.error('Error fetching item stock:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch item stock',
            error: error.message
        });
    }
});

module.exports = router;