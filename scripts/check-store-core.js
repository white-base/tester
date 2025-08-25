// packages/@logic-entity/product-core/scripts/check-store-core.js
const fs = require('fs');
const path = require('path');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function findStoreCorePkgJson(start) {
  let dir = start;
  while (true) {
    const candidate = path.join(dir, 'node_modules', '@logicfeel', 'store-core', 'package.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const pkgPath = findStoreCorePkgJson(process.cwd());
if (!pkgPath) {
  console.error('[product-core] store-core not found');
  process.exit(1);
}

const storePkg = readJSON(pkgPath);
const major = String(storePkg.version || '0.0.0').split('.')[0];

if (major !== '1') {
  console.error(`[product-core] Incompatible store-core major: ${storePkg.version} (need 1.x)`);
  process.exit(1);
}
console.log(`[product-core] store-core version OK: ${storePkg.version}`);