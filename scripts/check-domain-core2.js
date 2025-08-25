// scripts/check-domain-core.js
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getSelfInfo() {
  const selfPkg = readJson(path.resolve(__dirname, '..', 'package.json'));
  const selfVer = String(selfPkg.version || '0.0.0');
  const selfMajor = Number(selfVer.split('.')[0] || 0);
  return { name: selfPkg.name || '(unknown)', version: selfVer, major: selfMajor };
}

function pm() {
  const ua = String(process.env.npm_config_user_agent || '').toLowerCase();
  if (ua.includes('pnpm')) return 'pnpm';
  if (ua.includes('yarn')) return 'yarn';
  return 'npm';
}

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
  } catch (e) {
    // list 명령은 충돌/누락 시 비제로 종료 가능 → stdout를 최대한 활용
    return (e && e.stdout && e.stdout.toString('utf8')) || '';
  }
}

function parseJsonSafe(s) {
  try { return JSON.parse(s); } catch { return null; }
}

// npm 출력: 단일 객체 트리
// pnpm 출력: (워크스페이스면) 배열 [{name,version,dependencies:{...}}, ...]
function normalizeForest(json, packageManager) {
  if (!json) return [];
  if (packageManager === 'pnpm') {
    // pnpm --json 은 배열일 수도, 단일 객체일 수도 있음 → 배열로 통일
    return Array.isArray(json) ? json : [json];
  }
  // npm/yarn: 단일 객체로 간주 → 배열로 통일
  return [json];
}

function collectAllVersionsFromForest(forest, targetName) {
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
  for (const root of forest) walk(root);
  return Array.from(out);
}

(function main() {
  // ---- 1) 대상 패키지명을 인자로 받음
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node scripts/check-domain-core.js <target-package-name>');
    process.exit(1);
  }
  const TARGET = args[0];

  // ---- 2) 자기 메이저
  const self = getSelfInfo();

  // ---- 3) 패키지 매니저 별 트리 조회
  const rootCwd = process.env.INIT_CWD || process.cwd();
  const which = pm();

  let raw;
  if (which === 'pnpm') {
    // pnpm: 전체 트리(워크스페이스 포함) JSON
    raw = run('pnpm list --depth Infinity --json', rootCwd);
  } else {
    // npm/yarn: --all --json
    raw = run('npm ls --all --json', rootCwd);
  }

  const parsed = parseJsonSafe(raw);
  const forest = normalizeForest(parsed, which);
  if (!forest.length) {
    console.error(`[postinstall] cannot parse dependency tree (pm=${which})`);
    process.exit(1);
  }

  // ---- 4) 대상 패키지의 모든 버전 수집
  const versions = collectAllVersionsFromForest(forest, TARGET);
  if (versions.length === 0) {
    console.error(`[postinstall] ${TARGET} not found anywhere (require major ${self.major} to match ${self.name}@${self.version})`);
    process.exit(1);
  }

  // ---- 5) 메이저 불일치 검증
  const mismatches = versions.filter(v => Number(String(v).split('.')[0]) !== self.major);
  if (mismatches.length > 0) {
    console.error(`[postinstall] ${TARGET} major mismatch`);
    console.error(`  self: ${self.name}@${self.version} (require major ${self.major})`);
    console.error(`  found: ${versions.join(', ')}`);
    console.error(`  mismatched: ${mismatches.join(', ')}`);
    process.exit(1);
  }

  console.log(`[postinstall] OK: ${TARGET} versions=${versions.join(', ')} (all major=${self.major}) [pm=${which}]`);
})();