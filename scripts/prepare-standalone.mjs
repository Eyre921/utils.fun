import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const standaloneRoot = ".next/standalone";

await ensureExists(standaloneRoot);

const serverDir = await findStandaloneServerDir(standaloneRoot);

await copyDir(".next/static", join(serverDir, ".next/static"));
await copyDir("public", join(serverDir, "public"));

// Keep root-level copies for older start scripts that assume flat standalone layout
if (serverDir !== standaloneRoot) {
  await copyDir(".next/static", join(standaloneRoot, ".next/static"));
  await copyDir("public", join(standaloneRoot, "public"));
}

console.log(`Standalone assets prepared for: ${serverDir}`);

async function findStandaloneServerDir(root) {
  const direct = join(root, "server.js");
  if (await exists(direct)) {
    return root;
  }

  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === "node_modules") {
        continue;
      }
      const next = join(current, entry.name);
      if (await exists(join(next, "server.js"))) {
        return next;
      }
      stack.push(next);
    }
  }

  throw new Error(`Could not find server.js under ${root}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureExists(path) {
  if (!(await exists(path))) {
    throw new Error(`Missing standalone build output at ${path}. Run \`next build\` first.`);
  }
}

async function copyDir(source, destination) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true });
}
