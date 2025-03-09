const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

// ✅ Create a new report
router.post("/", async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json({ message: "Report saved successfully!", newReport });
  } catch (error) {
    res.status(500).json({ message: "Error saving report", error });
  }
});

// ✅ Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
});

// ✅ Get reports by category
router.get("/:category", async (req, res) => {
  try {
    const reports = await Report.find({ category: req.params.category });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
});

module.exports = router;
