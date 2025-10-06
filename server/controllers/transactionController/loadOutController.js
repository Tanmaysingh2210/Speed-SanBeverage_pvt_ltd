const LoadOut = require("../../models/transaction/LoadOut");

exports.addLoadout = async (req, res) => {
    try {
        const { salesmanCode, itemCode, Date, qty } = req.body;

        if (!salesmanCode || !itemCode || !Date || !qty) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadOut.findOne({ salesmanCode:salesmanCode, itemCode:itemCode, Date:Date });

        if (existing) return res.status(400).json({ message: `Loadout record of ${salesmanCode} at ${Date} exist for item: ${itemCode}` });

        await LoadOut.create({
            salesmanCode: salesmanCode,
            Date: Date,
            itemCode: itemCode,
            qty: qty
        });

        res.status(200).json({message:"loadout added sucessfully"});

    } catch (err) {
        res.status(500).json({message: "Error adding loadOut", error:err.message});
    }
}



