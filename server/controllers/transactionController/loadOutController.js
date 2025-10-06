const LoadOut = require("../../models/transaction/LoadOut");

exports.addLoadout = async (req, res) => {
    try {
        const { salesmanCode, itemCode, date, qty } = req.body;

        if (!salesmanCode || !itemCode || !date || !qty) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadOut.findOne({ salesman_code:salesmanCode, item_code:itemCode, Date:date });

        if (existing) return res.status(400).json({ message: `Loadout record of ${salesmanCode} at ${date} exist for item: ${itemCode}` });

        await LoadOut.create({
            salesman_code: salesmanCode,
            Date: date,
            item_code: itemCode,
            qty: qty
        });

        res.status(200).json({message:"loadout added sucessfully"});

    } catch (err) {
        res.status(500).json({message: "Error adding loadOut", error:err.message});
    }
}



