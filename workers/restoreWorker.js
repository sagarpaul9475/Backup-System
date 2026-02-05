const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const crypto = require("crypto");

function toBashPath(winPath) {
  return winPath
    .replace(/\\/g, "/")
    .replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
}

// 🔐 Verify checksum
function calculateChecksum(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", chunk => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", err => reject(err));
  });
}

function restoreBackup(backupPath, restoreDir, storedChecksum) {
  return new Promise(async (resolve, reject) => {
    try {
      const actualChecksum = await calculateChecksum(backupPath);

      if (actualChecksum !== storedChecksum) {
        return reject(new Error("Checksum mismatch! Backup may be corrupted."));
      }

      const scriptPath = path.resolve(__dirname, "../scripts/restore.sh");

      const bashScript = toBashPath(scriptPath);
      const bashBackup = toBashPath(backupPath);
      const bashRestore = toBashPath(restoreDir);

      const cmd = `bash "${bashScript}" "${bashBackup}" "${bashRestore}"`;

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        resolve(stdout.trim());
      });

    } catch (err) {
      reject(err);
    }
  });
}

function findBackupByTime(backups, targetTime) {
  let left = 0, right = backups.length - 1;
  let result = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTime = new Date(backups[mid].timestamp).getTime();

    if (midTime <= targetTime) {
      result = backups[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

module.exports = { findBackupByTime, restoreBackup };
