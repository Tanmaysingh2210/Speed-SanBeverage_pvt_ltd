const { Item } = require('../../models/SKU');

exports.addItem = async (req, res) => {
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

        res.status(200).json({ message: "item added sucessfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding item", error: err.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);

    } catch (err) {
        res.staus(500).json({ message: "Error fetching items", error: err.message });
    }
};

exports.getItembyId = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found!" });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: "Error fetching item", errro: err.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ message: "Item updated sucessfully", updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating Item", error: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item", error: err.message });
    }
};
