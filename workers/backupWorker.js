const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const Backup = require("../models/Backup");

function toBashPath(winPath) {
  return winPath
    .replace(/\\/g, "/")
    .replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
}

function runBackup(source, destination) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, "../scripts/backup.sh");

    const bashScript = toBashPath(scriptPath);
    const bashSource = toBashPath(source);
    const bashDest = toBashPath(destination);

    const cmd = `bash "${bashScript}" "${bashSource}" "${bashDest}"`;

    exec(cmd, async (err, stdout, stderr) => {
      if (err) {
        console.error("Backup script error:", stderr);
        return reject(err);
      }

      let filePath = stdout.trim();

      // convert back to Windows path
      if (filePath.startsWith("/")) {
        filePath = filePath.replace(/^\/([a-z])\//, (_, d) => `${d.toUpperCase()}:/`);
      }

      const checksumFile = filePath + ".sha256";

      const checksum = fs.readFileSync(checksumFile)
        .toString()
        .split(" ")[0];

      await Backup.create({
        sourcePath: source,
        destinationPath: filePath,
        checksum,
        status: "SUCCESS"
      });

      resolve();
    });
  });
}

module.exports = { runBackup };
