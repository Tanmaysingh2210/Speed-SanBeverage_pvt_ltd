const LoadOut = require('../models/transaction/LoadOut.js');
const LoadIn = require('../models/transaction/loadIn.js');
const S_sheet = require('../models/transaction/s_sheet.js');
const { Item } = require('../models/SKU.js');
const Salesman = require('../models/salesman.js');
const CashCredit = require('../models/transaction/CashCredit.js');
const Rates = require('../models/rates.js');


exports.DaywiseSummary = async (req, res) => {
    const normalize = v => v?.trim().toLowerCase();
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate || startDate > endDate) return res.status(400).json({ message: "Fill all fields properly", success: false });

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const [loadouts, loadins, cashcredits, sheets, rates, items] = await Promise.all([
            LoadOut.find({ date: { $gte: start, $lte: end } }),
            LoadIn.find({ date: { $gte: start, $lte: end } }),
            CashCredit.find({ date: { $gte: start, $lte: end } }),
            S_sheet.find({ date: { $gte: start, $lte: end } }),
            Rates.find({ date: { $lte: end } }).sort({ date: 1 }),
            Item.find()
        ]);

        // itemCode -> [rate1, rate2, ...] (sorted by date ASC)
        const rateMap = new Map();

        for (const r of rates) {
            const code = normalize(r.itemCode);
            if (!rateMap.has(code)) {
                rateMap.set(code, [])
            }
            rateMap.get(code).push(r);
        }

        console.log(rateMap);

        const itemMap = new Map();

        for (const i of items) {
            const code = normalize(i.code);
            itemMap.set(code, {
                itemCode: code,
                container: normalize(i.container)
            });

        }

        console.log(itemMap);

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

        const dayMap = new Map();
        const getDayKey = d => d.toISOString().split("T")[0]; // yyyy-mm-dd
        const ensureDay = (date) => {
            const key = getDayKey(date);
            if (!dayMap.has(key)) {
                dayMap.set(key, {
                    date: key,
                    sale: 0,
                    creditSale: 0,
                    cashDeposited: 0,
                    chequeDeposited: 0,
                    refunds: 0,
                    disc: 0,
                    missingRates: new Set(),
                    missingItems: new Set()
                });
            }
            return dayMap.get(key);
        }

        for (const lo of loadouts) {
            const day = ensureDay(lo.date);

            for (const item of lo.items) {
                const rate = getRateforDate(item.itemCode, lo.date);
                if (!rate) continue;

                const base = rate.basePrice;
                const disc = (base * (rate.perDisc || 0)) / 100;
                const tax = ((base - disc) * (rate.perTax || 0)) / 100;
                const finalPrice = base - disc + tax;

                day.sale += item.qty * finalPrice;

            }
        }

        for (const li of loadins) {
            const day = ensureDay(li.date);
            for (const item of li.items) {
                const rate = getRateforDate(normalize(item.itemCode), li.date);

                if (!rate) {
                    console.log("price not found for: ", normalize(item.itemCode));
                    continue;
                };

                const base = rate.basePrice;
                const disc = (base * (rate.perDisc || 0)) / 100;
                const tax = ((base - disc) * (rate.perTax || 0)) / 100;
                const finalPrice = base - disc + tax;

                const it = itemMap.get(normalize(item.itemCode));

                if (!it) {
                    day.missingItems.add(normalize(item.itemCode));
                    console.log(day.missingItems);
                    continue;
                }



                if (!it) continue;
                console.log(it);
                if (normalize(it.container) ===normalize("EMT") ) {
                    day.refunds += (item.Emt * finalPrice);
                    console.log(`refunds : ${day.refunds}`);
                } else {
                    day.sale -= ((item.Filled + item.Burst) * finalPrice);
                }

            }
        }

        for (const cc of cashcredits) {
            const day = ensureDay(cc.date);
            if (cc.crNo === 1) {
                day.cashDeposited += cc.cashDeposited || 0;
                day.chequeDeposited += cc.chequeDeposited || 0;
            } else {
                day.creditSale += cc.value || 0;
            }
        }

        const summary = Array.from(dayMap.values()).map(d => {
            const deposited = d.cashDeposited + d.chequeDeposited;
            const shortExcess = deposited - d.sale;

            return {
                date: d.date,
                sale: Number(d.sale.toFixed(2)),
                cashDeposited: Number(d.cashDeposited.toFixed(2)),
                chequeDeposited: Number(d.chequeDeposited.toFixed(2)),
                creditSale: Number(d.creditSale.toFixed(2)),
                refund: Number(d.refunds.toFixed(2)),
                shortExcess: Number(shortExcess.toFixed(2))
            };
        });

        summary.sort((a, b) => a.date.localeCompare(b.date));

        return res.json({
            success: true,
            data: summary
        });

    } catch (err) {
        console.error("Datewise summary error:", err);
        return res.status(500).json({
            message: "Summary error",
            error: err.message,
            success: false
        });
    }



}