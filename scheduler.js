const cron = require("node-cron");
const { runBackup } = require("./workers/backupWorker");
const { cleanupOldBackups } = require("./workers/retentionWorker");

// CHANGE THESE PATHS to your real folders
const SOURCE_PATH = "C:/Users/Sagar Paul/Documents/data";
const DEST_PATH = "C:/Users/Sagar Paul/Documents/backups";


// Run every hour
cron.schedule("*/1 * * * *", () => {
  cleanupOldBackups(3);
});


// Runs every 1 minute
cron.schedule("*/1 * * * *", () => {
  console.log("Scheduled backup started...");
  runBackup(SOURCE_PATH, DEST_PATH)
    .then(() => console.log("Scheduled backup completed"))
    .catch(err => console.error("Backup failed:", err.message));
});


