const fs = require("fs");
const Backup = require("../models/Backup");

async function cleanupOldBackups(days = 3) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  console.log("Retention check started...");

  const oldBackups = await Backup.find({
    timestamp: { $lt: cutoff }
  });

  for (const backup of oldBackups) {
    try {
      if (fs.existsSync(backup.destinationPath)) {
        fs.unlinkSync(backup.destinationPath);
        fs.unlinkSync(backup.destinationPath + ".sha256");
      }

      await Backup.deleteOne({ _id: backup._id });

      console.log("Deleted:", backup.destinationPath);

    } catch (err) {
      console.error("Retention error:", err.message);
    }
  }

  console.log("Retention cleanup completed");
}

module.exports = { cleanupOldBackups };
