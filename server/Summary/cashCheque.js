import CashCredit from '../models/transaction/CashCredit.js';
import Salesman from '../models/salesman.js';

export const CashChequeSummary = async (req, res) => {
        const normalize = v => v?.trim().toLowerCase();

    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) return res.status(400).json({ message: "All field are required", success: false });

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // const [cashCredits ,salesman] = await Promise.all([
        //     CashCredit.find({ date :{ $gte : start , $lte :end}}),
        //     Salesman.find({date: { $gte: start, $lte: end }})
        // ]);

        const cashCredits = await CashCredit.find(
            { date: { $gte: start, $lte: end } }
        );
        // const dayMap = new Map();
        // const getDayKey = d => d.toISOString().spilt("T")[0];
        // const ensureDay =(date)=>{
        //     const key = getDayKey(date);
        //     if(!dayMap.has(key)){

        //     }
        // }

        const salesmanMap = new Map();

        for (const cashcredit of cashCredits) {
            const cash = cashcredit.cashDeposited;
            const cheque = cashcredit.chequeDeposited;
            const date = cashcredit.date;
            
            const total = cash + cheque;
            if (!salesmanMap.has(cashcredit.salesmanCode)) {
                salesmanMap.set(cashcredit.salesmanCode,
                    {
                        date:date,
                        salesmanCode: cashcredit.salesmanCode,
                        totalCash: 0,
                        totalCheque: 0,
                        
                    }
                );
            }
            const agg = salesmanMap.get(cashcredit.salesmanCode);
            console.log(`agg: ${agg}`);
            agg.totalCash += cash;
            agg.totalCheque += cheque;
        }

        const summary = [];
        let grandTotalCash = 0;
        let grandTotalCheque = 0;

        for (const [salesmanCode, data] of salesmanMap) {
            const salesmanDetails = await Salesman.findOne({
                codeNo: salesmanCode.trim().toUpperCase(),
            });
            if (!salesmanDetails) continue;

            summary.push({
                date : data.date.toISOString().split("T")[0],
                salesmanCode,
                name: salesmanDetails.name,
                totalCash: data.totalCash,
                totalCheque: data.totalCheque
            });
            grandTotalCash += data.totalCash;
            grandTotalCheque += data.totalCheque;
        }
        summary.sort((a, b) => a.salesmanCode.localeCompare(b.salesmanCode));
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