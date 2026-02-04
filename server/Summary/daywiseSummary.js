import LoadOut from '../models/transaction/LoadOut.js';
import LoadIn from '../models/transaction/loadIn.js';
import S_sheet from '../models/transaction/s_sheet.js';
import { Item } from '../models/SKU.js';
import Salesman from '../models/salesman.js';
import CashCredit from '../models/transaction/CashCredit.js';
import Rates from '../models/rates.js';


export const DaywiseSummary = async (req, res) => {
    const normalize = v => typeof v === "string" ? v.trim().toLowerCase() : "";

    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate || startDate > endDate) return res.status(400).json({ message: "Fill all fields properly", success: false });

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const [loadouts, loadins, cashcredits, sheets, rates, items] = await Promise.all([
            LoadOut.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            LoadIn.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            CashCredit.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            S_sheet.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            Rates.find({ depo: req.user?.depo, date: { $lte: end } }).sort({ date: 1 }),
            Item.find({ depo: req.user?.depo })
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


        const itemMap = new Map();

        for (const i of items) {
            const code = normalize(i.code);
            itemMap.set(code, {
                itemCode: code,
                container: normalize(i.container)
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

        const dayMap = new Map();
        const getDayKey = d => d.toISOString().split("T")[0]; // yyyy-mm-dd
        const ensureDay = (date) => {
            const key = getDayKey(date);
            if (!dayMap.has(key)) {
                dayMap.set(key, {
                    date: key,
                    grossSale: 0,
                    credit: 0,
                    cash: 0,
                    cheque: 0,
                    refunds: 0,
                    disc: 0,
                    schm: 0,
                    ref: 0,
                    missingItems: []
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

                day.grossSale += item.qty * finalPrice;

            }
        }

        for (const li of loadins) {
            const day = ensureDay(li.date);
            for (const item of li.items) {
                const rate = getRateforDate(normalize(item.itemCode), li.date);

                if (!rate) {
                    continue;
                };

                const base = rate.basePrice;
                const disc = (base * (rate.perDisc || 0)) / 100;
                const tax = ((base - disc) * (rate.perTax || 0)) / 100;
                const finalPrice = base - disc + tax;

                const it = itemMap.get(normalize(item.itemCode));

                if (!it) {
                    day.missingItems.push(normalize(item.itemCode));
                    continue;
                }

                if (!it) continue;
                if (normalize(it.container) === normalize("EMT")) {
                    day.refunds += (item.Emt * finalPrice);
                } else {
                    day.grossSale -= ((item.Filled + item.Burst) * finalPrice);
                }
            }
        }

        for (const cc of cashcredits) {
            const day = ensureDay(cc.date);
            if (cc.crNo === 1) {
                day.cash += cc.cashDeposited || 0;
                day.cheque += cc.chequeDeposited || 0;
                day.ref += cc.ref || 0;
            } else {
                day.credit += cc.value || 0;
                day.ref += cc.ref || 0;
            }
        }

        for (const s of sheets) {
            const day = ensureDay(s.date);
            day.schm += (s.schm || 0);
        }

        const summary = Array.from(dayMap.values()).map(d => {
            const deposited = d.cash + d.cheque;
            const shortExcess = deposited + d.schm + d.ref - d.grossSale;

            return {
                date: d.date,
                grossSale: Number(d.grossSale.toFixed(2)),
                cashDeposited: Number(d.cash.toFixed(2)),
                chequeDeposited: Number(d.cheque.toFixed(2)),
                creditSale: Number(d.credit.toFixed(2)),
                refund: Number(d.refunds.toFixed(2)),
                schm: Number((d.schm).toFixed(2)),
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
};