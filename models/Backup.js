const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sourcePath: String,
  destinationPath: String,
  checksum: String,
  status: { type: String, enum: ["SUCCESS", "FAILED"] }
});

module.exports = mongoose.model("Backup", backupSchema);
