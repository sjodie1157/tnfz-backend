import { addItems, getItems, getSingleItem } from "../models/Items.js";

export default {
    getItems: async (req, res) => {
        try {
            const items = await getItems();
            res.json(items);
        } catch (error) {
            console.error("Error getting items:", error);
            res.status(500).json({ error: "Failed to retrieve items" });
        }
    },
    getSingleItem: async (req, res) => {
        try {
            const itemId = +req.params.id;
            const item = await getSingleItem(itemId);
            if (!item) {
                return res.status(404).json({ error: "Item not found" });
            }
            res.json(item);
        } catch (error) {
            console.error("Error getting single item:", error);
            res.status(500).json({ error: "Failed to retrieve item" });
        }
    },
    addItems: async (req, res) => {
        const { prodName, quantity, amount, catagory, prodURL } = req.body;
        try {
            if (!prodName || !quantity || !amount || !catagory || !prodURL) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            const newItem = await addItems(prodName, quantity, amount, catagory, prodURL);
            res.status(201).json(newItem);
        } catch (error) {
            console.error("Error adding item:", error);
            res.status(500).json({ error: "Failed to add item" });
        }
    },
};
