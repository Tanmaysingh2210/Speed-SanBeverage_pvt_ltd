const LoadIn=require('../../models/transaction/load_in');

exports.addLoadIn = async (req, res) => {
    try {
        const { salesmanCode, itemCode, Date, filled ,leaked } = req.body;

        if (!salesmanCode || !itemCode || !Date) return res.status(400).json({ message: "All fields are required" });

        const existing = await LoadIn.findOne({ salesmanCode:salesmanCode, itemCode:itemCode, Date:Date });

        if (existing) return res.status(400).json({ message: `Loadin record of ${salesmanCode} at ${Date} exist for item: ${itemCode}` });

        await LoadIn.create({
            salesmanCode: salesmanCode,
            Date: Date,
            itemCode: itemCode,
            filled:filled,
            leaked:leaked
        });

        res.status(200).json({message:"loadin added sucessfully"});

    } catch (err) {
        res.status(500).json({message: "Error adding loadin", error:err.message});
    }
}



