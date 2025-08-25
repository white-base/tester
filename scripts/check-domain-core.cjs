// scripts/check-store-core.js
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
  } catch (e) {
    return (e.stdout && e.stdout.toString('utf8')) || '';
  }
}

function parseJsonSafe(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function collectAllVersions(rootNode, targetName) {
  const out = new Set();
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    const deps = node.dependencies || {};
    for (const [depKey, depNode] of Object.entries(deps)) {
      if (depKey === targetName && depNode && depNode.version) {
        out.add(depNode.version);
      }
      if (depNode && depNode.name === targetName && depNode.version) {
        out.add(depNode.version);
      }
      walk(depNode);
    }
  }
  walk(rootNode);
  return Array.from(out);
}

(function main() {
  // ── ① 대상 패키지명 인자로 받기
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node check-store-core.js <target-package-name>');
    process.exit(1);
  }
  const TARGET = args[0];

  // ── ② 자기 메이저
  const selfPkg = readJson(path.resolve(__dirname, '..', 'package.json'));
  const selfVer = String(selfPkg.version || '0.0.0');
  const selfMajor = Number(selfVer.split('.')[0] || 0);

  // ── ③ 루트에서 전체 설치 트리 검사
  const rootCwd = process.env.INIT_CWD || process.cwd();
  const raw = run('npm ls --all --json', rootCwd);
  const tree = parseJsonSafe(raw);
  if (!tree) {
    console.error('[postinstall] cannot parse npm ls output');
    process.exit(1);
  }

  const versions = collectAllVersions(tree, TARGET);
  if (versions.length === 0) {
    console.error(`[postinstall] ${TARGET} not found (require major ${selfMajor} to match ${selfPkg.name}@${selfVer})`);
    process.exit(1);
  }

  const mismatches = versions.filter(v => Number(String(v).split('.')[0]) !== selfMajor);
  if (mismatches.length > 0) {
    console.error(`[postinstall] ${TARGET} major mismatch`);
    console.error(`  self: ${selfPkg.name}@${selfVer} (require major ${selfMajor})`);
    console.error(`  found: ${versions.join(', ')}`);
    console.error(`  mismatched: ${mismatches.join(', ')}`);
    process.exit(1);
  }

  console.log(`[postinstall] OK: ${TARGET} versions=${versions.join(', ')} (all major=${selfMajor})`);
})();