import LoadOut from "../models/transaction/LoadOut.js";
import LoadIn from "../models/transaction/loadIn.js";
import Salesman from "../models/salesman.js";
import salesman from "../models/salesman.js";

const getSalesmanwiseGraph = async ({ start, end, depo }) => {

    const normalize = v =>
        typeof v === "string" ? v.trim().toUpperCase() : "";

    const [loadouts, loadins, salesmans] = await Promise.all([
        LoadOut.find({ depo, date: { $gte: start, $lte: end } }),
        LoadIn.find({ depo, date: { $gte: start, $lte: end } }),
        Salesman.find({ depo })
    ]);

    const salesmanMap = new Map();
    for (const s of salesmans) {
        const code = normalize(s.codeNo);
        salesmanMap.set(code, {
            salesmanCode: code,
            salesmanName: s.name,
            qty: 0
        })
    }

    for (const loadout of loadouts) {
        const code = normalize(loadout.salesmanCode);
        for (const item of loadout.items) {
            salesmanMap.get(code).qty += item.qty;
        }
    }

    for (const loadin of loadins) {
        const code = normalize(loadin.salesmanCode);
        if (!salesmanMap.has(code)) continue;

        for (const item of loadin.items) {
            if (!item.Emt) continue;
            salesmanMap.get(code).qty -=
                ((item.Filled || 0) + (item.Burst || 0));
        }
    }

    const summary = [];

    for (const [salesmanCode, data] of salesmanMap) {
        summary.push({
            salesmanCode,
            salesmanName:data.salesmanName,
            qty: data.qty
        });
    }

    summary.sort((a, b) =>
        a.salesmanCode.localeCompare(b.salesmanCode)
    );

    return { summary };
};

export default getSalesmanwiseGraph;
