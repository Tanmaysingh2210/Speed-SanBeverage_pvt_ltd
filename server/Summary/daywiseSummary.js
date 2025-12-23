const LoadOut = require('../models/transaction/LoadOut.js');
const LoadIn = require('../models/transaction/loadIn.js');
const S_sheet = require('../models/transaction/s_sheet.js');
const { Item } = require('../models/SKU.js');
const Salesman = require('../models/salesman.js');
const CashCredit = require('../models/transaction/CashCredit.js');



exports.DaywiseSummary = async (req, res) => {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate || startDate > endDate) return res.status(400).json({ message: "Fill all fields properly" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const loadouts = await LoadOut.find({ date: { $gte: start, $lte: end } });
    const loadins = await LoadIn.find({ date: { $gte: start, $lte: end } });
    const s_sheets = await S_sheet.find({ date: { $gte: start, $lte: end } });
    const cashcredits = await CashCredit.find({ date: { $gte: start, $lte: end } });


}