const cron = require("node-cron");
const { runBackup } = require("./workers/backupWorker");

// CHANGE THESE PATHS to your real folders
const SOURCE_PATH = "C:/Users/Sagar Paul/Documents/data";
const DEST_PATH = "C:/Users/Sagar Paul/Documents/backups";

// Runs every day at 2 AM
cron.schedule("*/1 * * * *", () => {
  console.log("Scheduled backup started...");
  runBackup(SOURCE_PATH, DEST_PATH)
    .then(() => console.log("Scheduled backup completed"))
    .catch(err => console.error("Backup failed:", err.message));
});
