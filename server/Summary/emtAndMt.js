import LoadOut from '../models/transaction/LoadOut.js';
import LoadIn from '../models/transaction/loadIn.js';
import { Item } from '../models/SKU.js';
import Salesman from '../models/salesman.js';

export const EmtAndMtSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) return res.status(400).json({ message: "All field are required", success: false });

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const [loadouts, loadins, salesmans, items] = await Promise.all([
            LoadOut.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            LoadIn.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            Salesman.find({ depo: req.user?.depo }),
            Item.find({ depo: req.user?.depo }),

        ])

        const itemMap = new Map();
        for (const item of items) {
            itemMap.set(item.code.trim().toUpperCase(), item);
        }

        const salesmanMapDetails = new Map();
        for (const sm of salesmans) {
            salesmanMapDetails.set(sm.codeNo.trim().toUpperCase(), sm);
        }


        const summaryMap = new Map();


        for (const loadout of loadouts) {
            let mt = 0;
            for (const item of loadout.items) {
                const itemDoc = itemMap.get(item.itemCode.trim().toUpperCase());
                if (!itemDoc) continue;
                if (itemDoc.container.toLowerCase() === "mt") {
                    mt += item.qty;
                }

            }
            if (!summaryMap.has(loadout.salesmanCode)) {
                summaryMap.set(loadout.salesmanCode, {
                    salesmanCode: loadout.salesmanCode,
                    totalMt: 0,
                    totalEmt: 0
                });
            }

            summaryMap.get(loadout.salesmanCode).totalMt += mt;

        }

        for (const loadin of loadins) {
            let emt = 0;
            for (const item of loadin.items) {
                const itemDoc = itemMap.get(item.itemCode.trim().toUpperCase());
                if (!itemDoc) continue;
                if (itemDoc.container.toLowerCase() === "emt") {
                    emt += item.Emt;
                    console.log("emt:", emt);
                }
            }

            if (!summaryMap.has(loadin.salesmanCode)) {
                summaryMap.set(loadin.salesmanCode, {
                    salesmanCode: loadin.salesmanCode,
                    totalMt: 0,
                    totalEmt: 0
                });
            }
            summaryMap.get(loadin.salesmanCode).totalEmt += emt;
        }
        const summary = [];
        let grandTotalMt = 0;
        let grandTotalEmt = 0;
        for (const [salesmanCode, data] of summaryMap) {
            const sm = salesmanMapDetails.get(salesmanCode.trim().toUpperCase());
            if (!sm) continue;
            summary.push({
                salesmanCode,
                name: sm.name,
                totalMt: data.totalMt,
                totalEmt: data.totalEmt
            })

            grandTotalMt += data.totalMt;
            grandTotalEmt += data.totalEmt;
        }
        res.status(200).json({
            success: true,
            data: summary,
            grandTotal: {
                grandTotalMt: grandTotalMt,
                grandTotalEmt: grandTotalEmt
            }
        })
    }
    catch (err) {
        console.error('Error in Emt/mt  summary:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}