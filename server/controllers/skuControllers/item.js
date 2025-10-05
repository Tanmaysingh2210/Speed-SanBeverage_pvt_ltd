const { Item } = require('../../models/SKU');

exports.item = async (req, res) => {
    try {
        const { code, name, container, package, flavour } = req.body;

        if (!code || !name || !container || !package || !flavour) return res.status(400).json({ message: "Every field is reqired" });

        const existing = await Item.findOne({ code });

        if (existing) return res.status(400).json({ message: "this item already exists try adding different one" });

        await Item.create({
            code,
            name,
            container,
            package,
            flavour
        });

        res.status(400).json({ message: "item added sucessfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding item", error: err.message });
    }
}