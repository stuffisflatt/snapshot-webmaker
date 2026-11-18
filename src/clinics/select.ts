import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Path of the clinic file for this build: CLINIC=<slug> → src/clinics/<slug>.json (default alphastom). */
export function clinicDataPath(slug = process.env["CLINIC"] || "alphastom") {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) {
    const known = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => f.replace(/\.json$/, ""));
    throw new Error(`CLINIC="${slug}" has no src/clinics/${slug}.json (available: ${known.join(", ")})`);
  }
  return file;
}
