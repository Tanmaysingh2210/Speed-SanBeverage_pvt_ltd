import LoadOut from "../models/transaction/LoadOut.js";
import LoadIn from "../models/transaction/loadIn.js";

const getSalesmanwiseGraph = async ({ start, end, depo }) => {

    const normalize = v =>
        typeof v === "string" ? v.trim().toUpperCase() : "";

    const [loadouts, loadins] = await Promise.all([
        LoadOut.find({ depo, date: { $gte: start, $lte: end } }),
        LoadIn.find({ depo, date: { $gte: start, $lte: end } })
    ]);

    const salesmanMap = new Map();

    for (const loadout of loadouts) {

        const code = normalize(loadout.salesmanCode);

        if (!salesmanMap.has(code)) {
            salesmanMap.set(code, {
                salesmanCode: code,
                qty: 0
            });
        }

        for (const item of loadout.items) {
            salesmanMap.get(code).qty += item.qty;
        }
    }

    for (const loadin of loadins) {

        const code = normalize(loadin.salesmanCode);

        if (!salesmanMap.has(code)) continue;

        for (const item of loadin.items) {
            salesmanMap.get(code).qty -=
                ((item.Filled || 0) + (item.Burst || 0));
        }
    }

    const summary = [];

    for (const [salesmanCode, data] of salesmanMap) {
        summary.push({
            salesmanCode,
            qty: data.qty
        });
    }

    summary.sort((a, b) =>
        a.salesmanCode.localeCompare(b.salesmanCode)
    );

    return { summary };
};

export default getSalesmanwiseGraph;
