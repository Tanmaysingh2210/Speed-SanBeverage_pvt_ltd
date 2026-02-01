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
    const normalize = v => typeof v === "string" ? v.trim().toLowerCase() : "";

    try {
        const { salesmanCode, date, trip } = req.body;

        if (!salesmanCode || !date || !trip) return res.status(400).json({ message: "All field required" });

        const depo = req.user?.depo;
        const saleDate = new Date(date);

        const [s_sheet, loadout, loadin, cashCredit, rates] = await Promise.all([
            S_sheet.findOne({ salesmanCode, date, trip, depo }),
            LoadOut.findOne({ salesmanCode, date, trip, depo }),
            Loadin.findOne({ salesmanCode, date, trip, depo }),
            CashCredit.find({ salesmanCode, date, trip, depo }),
            Rate.find({ depo, date: { $lte: saleDate } }).sort({ date: 1 })
        ]);

        if (!loadout)
            return res.status(404).json({ message: "No loadout found" });

        const rateMap = new Map();
        for (const r of rates) {
            if (!rateMap.has(normalize(r.itemCode))) {
                rateMap.set(normalize(r.itemCode), []);
            }
            rateMap.get(normalize(r.itemCode)).push(r);
        }

        const getRate = (code) => {
            code = normalize(code);
            const list = rateMap.get(code) || [];
            let chosen = null;
            for (const r of list) {
                if (r.date <= saleDate) chosen = r;
                else break;
            }
            return chosen;
        };

        const loadinMap = new Map();
        loadin?.items.forEach(i => loadinMap.set(i.itemCode, i));

        let settlementItems = [];
        let NetSale = 0;
        let totalTax = 0;
        let totalDiscount = 0;
        let totalRefund = 0;

        // 3) LOOP THROUGH ALL LOADOUT ITEMS
        for (let lo of loadout.items) {

            const latestRate = getRate(lo.itemCode);
            if (!latestRate) continue;

            const returned = loadinMap.get(lo.itemCode);
            const returnedQty = (returned?.Filled || 0) + (returned?.Burst || 0);

            const finalQty = lo.qty - returnedQty;

            const basePrice = parseFloat((latestRate?.basePrice || 0).toFixed(2));
            const disc = basePrice * (latestRate?.perDisc || 0) / 100;
            const tax = (basePrice - disc) * (latestRate?.perTax || 0) / 100;
            const finalPrice = parseFloat((basePrice + tax - disc).toFixed(2));

            const sale = parseFloat((finalQty * finalPrice).toFixed(2));
            const discAmt = parseFloat((finalQty * disc).toFixed(2));
            const taxAmount = parseFloat((finalQty * tax).toFixed(2));

            // const amount = parseFloat((finalQty * finalPrice).toFixed(2));

            NetSale += sale;
            totalTax += taxAmount;
            totalDiscount += discAmt;

            settlementItems.push({
                itemCode: lo.itemCode,
                loadedQty: lo.qty,
                returnedQty,
                finalQty,
                basePrice,
                tax,
                disc,
                taxAmount,
                discAmt,
                finalPrice,
                amount: sale
            });
        }

        if (loadin) {
            for (const li of loadin.items) {
                if (!li.Emt) continue;
                const rate = getRate(li.itemCode);
                if (!rate) continue;

                const base = rate.basePrice;
                const disc = base * (rate.perDisc || 0) / 100;
                const tax = (base - disc) * (rate.perTax || 0) / 100;
                const price = base - disc + tax;

                totalRefund += li.Emt * price;
            }
        }

        NetSale = parseFloat(NetSale.toFixed(2));
        totalTax = parseFloat(totalTax.toFixed(2));
        totalDiscount = parseFloat(totalDiscount.toFixed(2));

        let cashDeposited = 0;
        let chequeDeposited = 0;
        let ref = 0;
        let creditSale = 0;

        for (const cc of cashCredit) {
            ref += cc.ref || 0;
            if (cc.crNo === 1) {
                cashDeposited += parseFloat((cc?.cashDeposited || 0).toFixed(2));
                chequeDeposited += parseFloat((cc?.chequeDeposited || 0).toFixed(2));
            } else {
                creditSale += parseFloat((cc.value + (cc.value * (cc.tax || 0)) / 100).toFixed(2));
            }
        }

        const totalPayable = NetSale - totalRefund - (s_sheet?.schm || 0) - ref;

        const totalDeposited = parseFloat((cashDeposited + chequeDeposited + creditSale).toFixed(2));

        const shortOrExcess = parseFloat((totalDeposited - totalPayable).toFixed(2));


        return res.json({
            salesmanCode,
            date,
            trip,
            schm: s_sheet.schm || 0,
            items: settlementItems,

            totals: {
                NetSale,
                totalDiscount,
                totalTax,
                totalRefund,
                totalDeposited,
                shortOrExcess,
            },

            cashCreditDetails: {
                cashDeposited,
                chequeDeposited,
                creditSale,
                ref
            }
        });
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