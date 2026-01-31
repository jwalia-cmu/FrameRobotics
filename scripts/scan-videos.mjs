import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const dir = path.join(root, "public", "videos");

if (!fs.existsSync(dir)) {
  console.error("Missing public/videos directory.");
  process.exit(1);
}

const allowed = new Set([".mp4", ".webm", ".mov"]);

const files = fs
  .readdirSync(dir)
  .filter((f) => allowed.has(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const manifest = {
  videos: files.map((f) => `/videos/${f}`),
};

const outPath = path.join(dir, "manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Wrote ${manifest.videos.length} video(s) to public/videos/manifest.json`);
