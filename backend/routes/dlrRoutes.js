const express = require("express");
const router = express.Router();
const DlrMapping = require("../models/DlrMapping");
const Vendor = require("../models/Vendor");

// ✅ Fetch all vendors for dropdown
router.get("/vendors", async (req, res) => {
    try {
        const vendors = await Vendor.find();  // Fetch vendors from MongoDB
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching vendors" });
    }
});

// ✅ Save DLR Mapping
router.post("/map", async (req, res) => {
    const { vendorId, dlrCodes } = req.body;

    console.log("Received request body:", req.body);

    if (!vendorId || !dlrCodes) {
        console.log("Missing fields or invalid data format");
        return res.status(400).json({ error: "Vendor ID and a DLR Code are required" });
    }

    try { 
       
            const newMapping = new DlrMapping({ vendorId, dlrCodes });
            await newMapping.save();
       
        console.log("Mapping Saved Successfully:", { vendorId, dlrCodes });
        res.json({ success: true, message: "DLR Code mapped successfully" });
    } catch (error) {
        console.error("Error saving mapping:", error);
        res.status(500).json({ error: "Error saving mapping" });
    }
});
router.get("/mappings", async (req, res) => {
    try {
        const mappings = await DlrMapping.find();
        res.json(mappings);
    } catch (error) {
        console.error("Error fetching mappings:", error);
        res.status(500).json({ error: "Error fetching mappings" });
    }
});
router.put("/mappings/:id", async (req, res) => {
    try {
        const { vendorId, dlrCodes } = req.body;
        const updatedMapping = await DlrMapping.findByIdAndUpdate(req.params.id, { vendorId, dlrCodes }, { new: true });
        res.json(updatedMapping);
    } catch (error) {
        console.error("Error updating mapping:", error);
        res.status(500).json({ error: "Error updating mapping" });
    }
});

router.delete("/mappings/:id", async (req, res) => {
    try {
        await DlrMapping.findByIdAndDelete(req.params.id);
        res.json({ message: "Mapping deleted successfully!" });
    } catch (error) {
        console.error("Error deleting mapping:", error);
        res.status(500).json({ error: "Error deleting mapping" });
    }
});
module.exports = router;  
