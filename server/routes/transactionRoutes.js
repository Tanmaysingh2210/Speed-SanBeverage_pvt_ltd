import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import loadoutRoutes from './transactionRoutes/loadoutRoutes.js';
import loadinRoutes from './transactionRoutes/loadinRoutes.js';
import cashcreditRoutes from './transactionRoutes/cashcreditRoutes.js';
import LoadOut from '../models/transaction/LoadOut.js';
import Loadin from '../models/transaction/loadIn.js';
import CashCredit from '../models/transaction/CashCredit.js';
import Rate from '../models/rates.js';
import S_sheet from '../models/transaction/s_sheet.js';
import Depo from '../models/depoModal.js';

router.use('/loadout', loadoutRoutes);
router.use('/loadin', loadinRoutes);
router.use('/cashcredit', cashcreditRoutes);

router.post("/settlement", async (req, res) => {
    try {
        const { salesmanCode, date, trip } = req.body;

        if (!salesmanCode || !date || !trip) return res.status(400).json({ message: "All field required" });

        const depo = req.user?.depo;

        const [s_sheet, loadout, loadin, cashCredit] = await Promise.all([
            S_sheet.findOne({ salesmanCode, date, trip, depo }),
            LoadOut.findOne({ salesmanCode, date, trip, depo }),
            Loadin.findOne({ salesmanCode, date, trip, depo }),
            CashCredit.find({ salesmanCode, date, trip, depo })
        ]);

        const selectedDate = new Date(date);

        if (!loadout)
            return res.status(404).json({ message: "No loadout found" });

        let settlementItems = [];
        let grandTotal = 0;
        let totalSale = 0;
        let totalTax = 0;
        let totalDiscount = 0;

        // 3) LOOP THROUGH ALL LOADOUT ITEMS
        for (let item of loadout.items) {

            const loadinItem = loadin
                ? loadin.items.find(li => li.itemCode === item.itemCode)
                : null;

            const finalQty = item.qty - ((loadinItem?.Filled + loadinItem?.Burst) || 0);

            // 4) FETCH LATEST PRICE
            const latestRate = await Rate.findOne({
                itemCode: item.itemCode,
                depo: depo,
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
            totalTax += taxAmount;
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
        totalTax = parseFloat(totalTax.toFixed(2));
        totalDiscount = parseFloat(totalDiscount.toFixed(2));

        let cashDeposited = 0;
        let chequeDeposited = 0;
        let ref = 0;
        let creditSale = 0;

        for (const cc of cashCredit) {
            if (cc.crNo === 1) {
                cashDeposited += parseFloat((cc?.cashDeposited || 0).toFixed(2));
                chequeDeposited += parseFloat((cc?.chequeDeposited || 0).toFixed(2));
                ref += parseFloat((cc?.ref || 0).toFixed(2));
                console.log(ref);
            } else {
                creditSale += parseFloat((cc.value + (cc.value * (cc.tax) || 0) / 100).toFixed(2));
                ref += parseFloat((cc?.ref || 0).toFixed(2));
                console.log(ref);
            }
        }


        const totalDeposited = parseFloat((cashDeposited + chequeDeposited + creditSale + ref).toFixed(2));

        // 7) CALCULATE SHORT / EXCESS
        const shortOrExcess = parseFloat((totalDeposited - grandTotal).toFixed(2));

        // 8) SEND FINAL RESPONSE
        if (s_sheet) {
            return res.json({
                salesmanCode,
                date,
                trip,
                schm: s_sheet.schm,
                items: settlementItems,

                totals: {
                    totalSale,
                    grandTotal,
                    totalDiscount,
                    totalTax,
                    totalDeposited,
                    shortOrExcess,   // + means excess, - means short
                },

                cashCreditDetails: {
                    cashDeposited,
                    chequeDeposited,
                    creditSale,
                    ref
                }
            });
        }
        else {
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
                    creditSale,
                    ref
                }
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Settlement error", error: err.message });
    }
});



router.post("/settlement/save-schm", async (req, res) => {
    try {
        const { salesmanCode, date, trip, schm } = req.body;

        if (!salesmanCode || !date || !trip) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const depo = req.user?.depo;

        const updated = await S_sheet.findOneAndUpdate(
            { salesmanCode, date, trip, depo },
            { $set: { schm } },
            { upsert: true, new: true }
        );

        return res.json({
            success: true,
            schm: updated.schm
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to save discount",
            error: err.message
        });
    }
});

export default router;