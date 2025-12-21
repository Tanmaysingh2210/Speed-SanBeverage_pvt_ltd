const LoadOut = require('../models/transaction/LoadOut.js');
const Rates = require('../models/rates.js');
const { Item } = require('../models/SKU.js');

exports.ItemWiseSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) return res.status(400).json({ message: "All field are required", success: false });

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const loadouts = await LoadOut.find(
            { date: { $gte: start, $lte: end } }
        );

        const itemMap = new Map();

        for (const loadout of loadouts) {
            for (const item of loadout.items) {
                const rate = await Rates.findOne({
                    itemCode: item.itemCode,
                    date: { $lte: loadout.date }
                }).sort({ date: -1 });

                console.log(rate);

                if (!rate) continue;

                const baseAmount = rate.basePrice * item.qty;
                const taxableAmount = baseAmount - (baseAmount * ((rate.perDisc || 0) / 100));
                const taxAmount = taxableAmount * ((rate.perTax || 0) / 100);
               
                const finalAmount = taxableAmount + taxAmount ;
                console.log(`finalAmount: ${finalAmount}`);

                if (!itemMap.has(item.itemCode)) {
                    itemMap.set(item.itemCode, {
                        itemCode: item.itemCode,
                        qty: 0,
                        amount: 0
                    });
                }

                const agg = itemMap.get(item.itemCode);
                console.log(`agg: ${agg}`);
                agg.qty += item.qty;
                agg.amount += finalAmount;
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