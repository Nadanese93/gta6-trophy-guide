import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const PORT = 8080;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url?.split("?")[0] ?? "/") || "/";
  const file = join(ROOT, path === "/" ? "index.html" : path);
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`Leonida Field Guide serving app/ on http://localhost:${PORT}`));
