const express = require('express');
const router = express.Router();

const loadoutRoutes = require('./transactionRoutes/loadoutRoutes');
const loadinRoutes = require('./transactionRoutes/loadinRoutes');
const cashcreditRoutes = require('./transactionRoutes/cashcreditRoutes');
const LoadOut = require('../models/transaction/LoadOut');
const Loadin = require('../models/transaction/loadIn');
const CashCredit = require('../models/transaction/CashCredit');
const Rate = require('../models/rates')


router.use('/loadout', loadoutRoutes);
router.use('/loadin', loadinRoutes);
router.use('/cashcredit', cashcreditRoutes);

router.post("/settlement", async (req, res) => {
    try {
        const { salesmanCode, date, trip } = req.body;
        const selectedDate = new Date(date);

        // 1) FETCH LOADOUT
        const loadout = await LoadOut.findOne({
            salesmanCode,
            date,
            trip
        });

        if (!loadout)
            return res.status(404).json({ message: "No loadout found" });

        // 2) FETCH LOADIN (may not exist)
        const loadin = await Loadin.findOne({
            salesmanCode,
            date,
            trip
        });

        let settlementItems = [];
        let grandTotal = 0;
        let totalSale = 0;
        let totalDiscount = 0;

        // 3) LOOP THROUGH ALL LOADOUT ITEMS
        for (let item of loadout.items) {

            const loadinItem = loadin
                ? loadin.items.find(li => li.itemCode === item.itemCode)
                : null;

            const finalQty = item.qty - (loadinItem?.qty || 0);

            // 4) FETCH LATEST PRICE
            const latestRate = await Rate.findOne({
                itemCode: item.itemCode,
                date: { $lte: selectedDate }
            })
                .sort({ date: -1 })
                .limit(1);

            const basePrice = parseFloat((latestRate?.basePrice || 0).toFixed(2));
            const perDisc = parseFloat((latestRate?.perDisc || 0).toFixed(2));
            const perTax = parseFloat((latestRate?.perTax || 0).toFixed(2));

            const sale = parseFloat((finalQty * basePrice).toFixed(2));
            const discAmount = parseFloat(((basePrice * perDisc) / 100).toFixed(2));
            const taxAmount = parseFloat((((basePrice - discAmount) * perTax) / 100).toFixed(2));

            const finalPrice = parseFloat((basePrice + taxAmount - discAmount).toFixed(2));

            const amount = parseFloat((finalQty * finalPrice).toFixed(2));

            totalSale += sale;
            grandTotal += amount;
            totalDiscount += finalQty * discAmount;

            settlementItems.push({
                itemCode: item.itemCode,
                loadedQty: item.qty,
                returnedQty: loadinItem?.qty || 0,
                finalQty,
                basePrice,
                perTax,
                perDisc,
                taxAmount,
                discAmount,
                finalPrice,
                amount
            });
        }

        totalSale = parseFloat(totalSale.toFixed(2));
        grandTotal = parseFloat(grandTotal.toFixed(2));
        totalDiscount = parseFloat(totalDiscount.toFixed(2));

        // 6) FETCH CASH/CREDIT ENTRY FOR THAT DATE
        const cashCredit = await CashCredit.findOne({
            salesmanCode,
            date,
            trip: trip
        });

        const cashDeposited = parseFloat((cashCredit?.cashDeposited || 0).toFixed(2));
        const chequeDeposited = parseFloat((cashCredit?.chequeDeposited || 0).toFixed(2));
        const ref = parseFloat((cashCredit?.ref || 0).toFixed(2));

        const totalDeposited = parseFloat((cashDeposited + chequeDeposited).toFixed(2));

        // 7) CALCULATE SHORT / EXCESS
        const shortOrExcess = parseFloat((totalDeposited - grandTotal).toFixed(2));

        // 8) SEND FINAL RESPONSE
        return res.json({
            salesmanCode,
            date,
            trip,

            items: settlementItems,

            totals: {
                totalSale,
                grandTotal,
                totalDiscount,
                totalDeposited,
                shortOrExcess,   // + means excess, - means short
            },

            cashCreditDetails: {
                cashDeposited,
                chequeDeposited,
                ref
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Settlement error", error: err.message });
    }
});




module.exports = router;