import express from 'express';
const router = express.Router();
import StockService from '../services/StockCalculator.js';
import requireAuth from '../middleware/requireAuth.js';
import requireDepo from '../middleware/requireDepo.js';

router.use(requireAuth);
router.use(requireDepo);

router.get('/', async (req, res) => {
    try {
        const stock = await StockService.getCurrentStock(req.user?.depo);

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
        let days = Number(req.query.days);

        if (!Number.isInteger(days) || days <= 0) {
            days = 30;
        }

        const expiringItems = await StockService.getExpiringItems(req.user?.depo, days);

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
        const result = await StockService.cleanupExpiredItems(req.user?.depo);

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
        const itemStock =
            await StockService.getStockByItemCode(
                req.user?.depo,
                req.params.itemCode
            );

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
        res.status(500).json({
            success: false,
            message: 'Failed to fetch item stock',
            error: error.message
        });
    }
});


export default router;