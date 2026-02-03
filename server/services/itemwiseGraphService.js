import LoadOut from "../models/transaction/LoadOut.js";
import LoadIn from "../models/transaction/loadIn.js";
import { Item } from "../models/SKU.js";

const getItemwiseGraph = async ({ start, end, depo }) => {
    const normalize = v => typeof v === "string" ? v.trim().toUpperCase() : "";

    const [loadouts, loadins, items] = await Promise.all([
        LoadOut.find({ depo, date: { $gte: start, $lte: end } }),
        LoadIn.find({ depo, date: { $gte: start, $lte: end } }),
        Item.find({ depo })
    ]);

    const itemMap = new Map();
    for (const i of items) {
        const code = normalize(i.code);
        if (normalize(i.container) === normalize("emt")) continue;
        else {
            itemMap.set(code, {
                itemCode: code,
                itemName: i.name,
                qty: 0
            });
        }
    }

    for (const loadout of loadouts) {
        for (const item of loadout.items) {
            const agg = itemMap.get(normalize(item.itemCode));
            if (!agg) continue;
            agg.qty += item.qty;
        }
    }

    for (const loadin of loadins) {
        for (const item of loadin.items) {
            const agg = itemMap.get(normalize(item.itemCode));
            if (!agg) continue;
            agg.qty -= ((item.Filled || 0) + (item.Burst || 0));
        }
    }

    const summary = [];

    for (const [itemCode, data] of itemMap) {
        summary.push({
            itemCode,
            name: data.itemName,
            qty: data.qty,
        });
    }

    summary.sort((a, b) => a.itemCode.localeCompare(b.itemCode));

    return {
        summary
    }
};

export default getItemwiseGraph;