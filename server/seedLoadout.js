import mongoose from "mongoose";
import LoadOut from "./models/transaction/LoadOut.js";

await mongoose.connect("mongodb://localhost:27017/Speed");

const itemCodes = ["P200", "D1000", "S220", "L500", "D200"];

function randomQty() {
    return Math.floor(Math.random() * 6) + 1;
}

const docs = [];
let baseDate = new Date("2028-12-20");

for (let i = 0; i < 500000; i++) {
    docs.push({
        salesmanCode: "M001",
        date: new Date(baseDate),
        trip: i + 1,
        depo: "6975b4900d7fc703a20591dd",
        items: [
            { itemCode: itemCodes[Math.floor(Math.random() * itemCodes.length)], qty: randomQty() },
            { itemCode: itemCodes[Math.floor(Math.random() * itemCodes.length)], qty: randomQty() }
        ]
    });
}

await LoadOut.insertMany(docs);

console.log("Inserted", docs.length, "documents");

process.exit();
