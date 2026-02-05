const express = require("express");
const router = express.Router();
const { runBackup } = require("../workers/backupWorker");
const Backup = require("../models/Backup");
const { findBackupByTime, restoreBackup } = require("../workers/restoreWorker");


// trigger backup manually
router.post("/run", async (req, res) => {
  const { source, destination } = req.body;

  console.log("Run Backup API called");
  console.log("Source:", source);
  console.log("Destination:", destination);

  try {
    await runBackup(source, destination);
    console.log("Backup completed");
    res.json({ message: "Backup completed" });
  } catch (err) {
    console.error("Backup error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



router.post("/restore", async (req, res) => {
  const { timestamp, restorePath } = req.body;

  const backups = await Backup.find().sort({ timestamp: 1 });
  const targetTime = new Date(timestamp).getTime();

  const backupToRestore = findBackupByTime(backups, targetTime);

  if (!backupToRestore) {
    return res.status(404).json({ message: "No backup found" });
  }

  try {
    await restoreBackup(
      backupToRestore.destinationPath,
      restorePath,
      backupToRestore.checksum
    );

    res.json({
      message: "Restore completed with checksum verification",
      backup: backupToRestore
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});


// list backups
router.get("/", async (req, res) => {
  const backups = await Backup.find().sort({ timestamp: 1 });
  res.json(backups);
});

module.exports = router;
