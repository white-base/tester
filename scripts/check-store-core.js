// // packages/@logic-entity/product-core/scripts/check-store-core.js
// const fs = require('fs');
// const path = require('path');

// function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

// function findStoreCorePkgJson(start) {
//   let dir = start;
//   while (true) {
//     const candidate = path.join(dir, 'node_modules', '@logicfeel', 'store-core', 'package.json');
//     if (fs.existsSync(candidate)) return candidate;
//     const parent = path.dirname(dir);
//     if (parent === dir) return null;
//     dir = parent;
//   }
// }

// const pkgPath = findStoreCorePkgJson(process.cwd());
// if (!pkgPath) {
//   console.error('[product-core] store-core not found');
//   process.exit(1);
// }

// const storePkg = readJSON(pkgPath);
// const major = String(storePkg.version || '0.0.0').split('.')[0];

// if (major !== '1') {
//   console.error(`[product-core] Incompatible store-core major: ${storePkg.version} (need 1.x)`);
//   process.exit(1);
// }
// console.log(`[product-core] store-core version OK: ${storePkg.version}`);

// scripts/check-store-core.js
const fs = require('fs'), path = require('path');
function findPkgJson(start) {
  let dir = start;
  while (true) {
    const p = path.join(dir, 'node_modules', '@logicfeel', 'store-core', 'package.json');
    if (fs.existsSync(p)) return p;
    const up = path.dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}
const p = findPkgJson(process.cwd());
if (!p) { console.error('store-core not found'); process.exit(1); }
const { version } = JSON.parse(fs.readFileSync(p, 'utf8'));
if (!/^1\./.test(version)) {
  console.error(`need @logicfeel/store-core ^1, got ${version}`);
  process.exit(1);
}
console.log(`store-core ok: ${version}`);