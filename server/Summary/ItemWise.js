const LoadOut = require('../models/transaction/LoadOut.js');
const LoadIn = require('../models/transaction/loadIn.js');
const Rates = require('../models/rates.js');
const { Item } = require('../models/SKU.js');

exports.ItemWiseSummary = async (req, res) => {
    const normalize = v => v?.trim().toLowerCase();
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate || startDate > endDate) return res.status(400).json({ message: "fill all fields properly", success: false });

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const [loadouts, loadins, rates, items] = await Promise.all([
            LoadOut.find({ date: { $gte: start, $lte: end } }),
            LoadIn.find({ date: { $gte: start, $lte: end } }),
            Rates.find({ date: { $lte: end } }).sort({ date: 1 }),
            Item.find()
        ]);


        const rateMap = new Map();
        for (const r of rates) {
            const code = normalize(r.itemCode);
            if (!rateMap.has(code)) {
                rateMap.set(code, [])
            }
            rateMap.get(code).push(r);
        };

        const itemMap = new Map();

        for (const i of items) {
            const code = normalize(i.code);
            itemMap.set(code, {
                itemCode: code,
                container: normalize(i.container),
                qty: 0,
                amount: 0
            });
        }

        const getRateforDate = (itemCode, saleDate) => {
            const list = rateMap.get(normalize(itemCode));
            if (!list) return null;

            let choosen = null;
            for (const r of list) {
                if (r.date <= saleDate) choosen = r;
                else break;
            }

            return choosen;
        };

        for (const loadout of loadouts) {
            for (const item of loadout.items) {
                const rate = getRateforDate(item.itemCode, loadout.date);
                if (!rate) continue;

                const baseAmount = rate.basePrice * item.qty;
                const taxableAmount = baseAmount - (baseAmount * ((rate.perDisc || 0) / 100));
                const taxAmount = taxableAmount * ((rate.perTax || 0) / 100);

                const finalAmount = taxableAmount + taxAmount;

                const agg = itemMap.get(normalize(item.itemCode));
                agg.qty += item.qty;
                agg.amount += (item.qty) * finalAmount;
            }
        }

        for (const loadin of loadins) {
            for (const item of loadin.items) {
                const rate = getRateforDate(item.itemCode, loadin.date);
                if (!rate) continue;

                const baseAmount = rate.basePrice * item.qty;
                const taxableAmount = baseAmount - (baseAmount * ((rate.perDisc || 0) / 100));
                const taxAmount = taxableAmount * ((rate.perTax || 0) / 100);

                const finalAmount = taxableAmount + taxAmount;

                const agg = itemMap.get(normalize(item.itemCode));
                if (agg.container === normalize("emt")) {
                    continue;
                } else {
                    agg.qty -= item.qty;
                    agg.amount -= (item.qty) * finalAmount;
                }
            }
        }

        const summary = [];
        let grandTotalQty = 0;
        let grandTotalAmount = 0;

        for (const [itemCode, data] of itemMap) {
            const itemDetails = await Item.findOne({
                code: itemCode.trim().toUpperCase(),
            });

            if (!itemDetails) continue;

            summary.push({
                itemCode,
                name: itemDetails.name,
                qty: data.qty,
                amount: parseFloat(data.amount.toFixed(2))
            });

            grandTotalQty += data.qty;
            grandTotalAmount += data.amount;
        }

        summary.sort((a, b) => a.itemCode.localeCompare(b.itemCode));

        res.status(200).json({
            success: true,
            data: summary,
            grandTotal: {
                qty: grandTotalQty,
                amount: parseFloat(grandTotalAmount.toFixed(2))
            }
        });

    }
    catch (err) {
        console.error('Error in itemwise summary:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}