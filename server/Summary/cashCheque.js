import CashCredit from '../models/transaction/CashCredit.js';
import Salesman from '../models/salesman.js';

export const CashChequeSummary = async (req, res) => {
    const normalize = v => typeof v === "string" ? v.trim().toLowerCase() : "";


    const getDateKey = (d) => d.toISOString().split("T")[0];

    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) return res.status(400).json({ message: "All field are required", success: false });

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const [cashCredits, salesmans] = await Promise.all([
            CashCredit.find({ depo: req.user?.depo, date: { $gte: start, $lte: end } }),
            Salesman.find({ depo: req.user?.depo })
        ]);

        const salesmanMapDetails = new Map();
        for (const sm of salesmans) {
            salesmanMapDetails.set(sm.codeNo.trim().toUpperCase(), sm);
        }

        const summaryMap = new Map();

        for (const cashcredit of cashCredits) {
            if (cashcredit.crNo != 1) continue;
            const dateKey = getDateKey(cashcredit.date);
            const salesmanCode = cashcredit.salesmanCode.trim().toUpperCase();
            const mapKey = `${dateKey} | ${salesmanCode}`;

            const cash = cashcredit.cashDeposited || 0;
            const cheque = cashcredit.chequeDeposited || 0;

            const total = cash + cheque;
            if (!summaryMap.has(mapKey)) {
                summaryMap.set(mapKey,
                    {
                        date: dateKey,
                        salesmanCode: salesmanCode,
                        totalCash: 0,
                        totalCheque: 0,
                    }
                );
            }
            const agg = summaryMap.get(mapKey);
            agg.totalCash += cash;
            agg.totalCheque += cheque;
        }

        const summary = [];
        let grandTotalCash = 0;
        let grandTotalCheque = 0;

        for (const data of summaryMap.values()) {
            const sm = salesmanMapDetails.get(data.salesmanCode.trim().toUpperCase());
            if (!sm) continue;

            summary.push({
                date: data.date,
                salesmanCode: data.salesmanCode,
                name: sm.name,
                totalCash: data.totalCash,
                totalCheque: data.totalCheque
            });
            grandTotalCash += data.totalCash;
            grandTotalCheque += data.totalCheque;
        }
        summary.sort((a, b) =>
            a.date.localeCompare(b.date) ||
            a.salesmanCode.localeCompare(b.salesmanCode)
        );
        res.status(200).json({
            success: true,
            data: summary,
            grandTotal: {
                grandTotalCash: grandTotalCash,
                grandTotalCheque: grandTotalCheque
            }
        })
    }
    catch (err) {
        console.error('Error in cash/cheque summary:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}