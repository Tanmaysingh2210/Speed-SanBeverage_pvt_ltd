const mongoose = require('mongoose');
const Loadout = require('../models/transaction/LoadOut.js');
const PurchaseItemwise = require('../models/purchase/PurchaseItemwise.js');

class StockService {
    static async cleanupExpiredItems() {
        const now = new Date();

        const purchases = await PurchaseItemwise.find({ isFullyProcessed: false });

        let totalExpiredQty = 0;
        const expiredLog = [];

        for (const purchase of purchases) {
            let hasChanges = false;

            purchase.items = purchase.items.filter(item => {
                if (item.expiryDate <= now && item.remainingQty > 0) {
                    expiredLog.push({
                        itemCode: item.itemCode,
                        qty: item.remainingQty,
                        expiryDate: item.expiryDate,
                        purchaseDate: purchase.date
                    });
                    totalExpiredQty += item.remainingQty;
                    hasChanges = true;
                    return false; //remove expired item from array
                }
                return true;
            });


            const allExhausted = purchase.items.every(item => item.remainingQty <= 0);

            if (allExhausted || purchase.items.length === 0) {
                purchase.isFullyProcessed = true;
                hasChanges = true;
            }

            if (hasChanges) await purchase.save();
        }
        return { totalExpiredQty, expiredLog };
    }

    static async processLoadout(loadoutItems) {
        const results = [];
        const now = new Date();

        for (const loadoutItem of loadoutItems) {
            let remainingToLoad = loadoutItem.qty;
            const allocations = [];

            const purchases = await PurchaseItemwise.find({
                isFullyProcessed: false,
                'items.itemCode': loadoutItem.itemCode,
                'items.remainingQty': { $gt: 0 },
                'items.expiryDate': { $gt: now }
            }).sort({ 'items.expiryDate': 1 });

            for (const purchase of purchases) {
                if (remainingToLoad <= 0) break;

                for (const item of purchase.items) {
                    if (item.itemCode === loadoutItem.itemCode &&
                        item.remainingQty > 0 &&
                        item.expiryDate > now
                    ) {
                        const qtyToDeduct = Math.min(item.remainingQty, remainingToLoad);
                        item.remainingQty -= qtyToDeduct;
                        remainingToLoad -= qtyToDeduct;

                        allocations.push({
                            purchaseId: purchase._id,
                            purchaseDate: purchase.date,
                            expiryDate: item.expiryDate,
                            qty: qtyToDeduct
                        });

                        const allExhausted = purchase.items.every(i => i.remainingQty <= 0);
                        if (allExhausted) purchase.isFullyProcessed = true;

                        await purchase.save();

                        if (remainingToLoad <= 0) break;
                    }
                }
            }

            results.push({
                itemCode: loadoutItem.itemCode,
                requestedQty: loadoutItem.qty,
                allocatedQty: loadoutItem.qty - remainingToLoad,
                shortfall: remainingToLoad,
                allocations
            });
        }
        return results;
    }


    //get current stock summary
    static async getCurrentStock() {
        const now = new Date();

        const purchases = await PurchaseItemwise.find({
            isFullyProcessed: false
        });

        const stockMap = new Map();

        for (const purchase of purchases) {
            for (const item of purchase.items) {
                if (item.remainingQty <= 0 || item.expiryDate <= now) {
                    continue;
                }

                if (!stockMap.has(item.itemCode)) {
                    stockMap.set(item.itemCode, {
                        itemCode: item.itemCode,
                        totalQty: 0,
                        batches: []
                    });
                }

                const stock = stockMap.get(item.itemCode);
                stock.totalQty += item.remainingQty;
                stock.batches.push({
                    purchaseId: purchase._id,
                    purchaseDate: purchase.date,
                    qty: item.remainingQty,
                    expiryDate: item.expiryDate,
                    daysUntilExpiry: Math.ceil((item.expiryDate - now) / (1000 * 60 * 60 * 24))
                });
            }
        }

        // Sort batches by expiry date for each item
        stockMap.forEach(stock => {
            stock.batches.sort((a, b) => a.expiryDate - b.expiryDate);
        });

        return Array.from(stockMap.values()).sort((a, b) =>
            a.itemCode.localeCompare(b.itemCode)
        );
    }

    static async getExpiringItems(daysThreshold = 30) {
        const now = new Date();
        const thresholdDate = new Date(now.getTime() + (daysThreshold * 24 * 60 * 60 * 1000));

        const purchases = await PurchaseItemwise.find({
            isFullyProcessed: false,
            'items.expiryDate': { $gt: now, $lte: thresholdDate },
            'items.remainingQty': { $gt: 0 }
        });

        const expiringItems = [];

        for (const purchase of purchases) {
            for (const item of purchase.items) {
                if (item.remainingQty > 0 &&
                    item.expiryDate > now &&
                    item.expiryDate <= thresholdDate
                ) {
                    expiringItems.push({
                        itemCode: item.itemCode,
                        qty: item.remainingQty,
                        expiryDate: item.expiryDate,
                        purchaseDate: purchase.date,
                        daysUntilExpiry:Math.ceil((item.expiryDate - now)/(1000*60*60*24))
                    });
                }
            }
        }
        return expiringItems.sort((a,b)=>a.expiryDate - b.expiryDate);
    }
}


module.exports = StockService;