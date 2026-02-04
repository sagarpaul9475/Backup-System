const path = require("path");
const { exec } = require("child_process");

function toBashPath(winPath) {
  return winPath
    .replace(/\\/g, "/")
    .replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
}

function restoreBackup(backupPath, restoreDir) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, "../scripts/restore.sh");

    const bashScript = toBashPath(scriptPath);
    const bashBackup = toBashPath(backupPath);
    const bashRestore = toBashPath(restoreDir);

    const cmd = `bash "${bashScript}" "${bashBackup}" "${bashRestore}"`;

    exec(cmd, (err, stdout, stderr) => {
    console.log("Restore CMD:", cmd);
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (err) {
      return reject(err);
    }

    resolve(stdout.trim());
  });
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
