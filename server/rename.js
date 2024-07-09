import { exec } from "node:child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const srcDir = path.join(__dirname, "src");
const outDir = path.join(__dirname, "dist");

exec(`babel ${srcDir} -d ${outDir}`, (err, stdout, stderr) => {
  if (err) {
    console.err(`Error during Babel compilation: ${stderr}`);
    process.exit(1);
  }
  console.log(`Babel compilation complete: ${stdout}`);

  fs.readdir(outDir, (err, files) => {
    if (err) {
      console.error(`Error reading output directory: ${err}`);
      process.exit(1);
    }
    files.forEach((file) => {
      if (path.extname(file) === ".js") {
        const oldPath = path.join(outDir, file);
        const newPath = path.join(outDir, path.basename(file, ".js") + ".cjs");

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error(`Error renaming file ${oldPath}: ${err}`);
            process.exit(1);
          }
        });
      }
    });
  });
});
