// scripts/check-store-core.js
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const TARGET = '@logicfeel/store-core';

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
  } catch (e) {
    // npm ls는 충돌 시 비제로 종료 -> stdout 최대 활용
    return (e.stdout && e.stdout.toString('utf8')) || '';
  }
}

function parseJsonSafe(s) {
  try { return JSON.parse(s); } catch { return null; }
}

/**
 * 전체 트리를 순회하며 TARGET 이름의 버전들을 수집한다.
 * - depKey 를 기준으로 패키지명을 식별
 * - depNode.name 도 백업 체크
 */
function collectAllVersions(rootNode, targetName) {
  const out = new Set();

  function walk(node) {
    if (!node || typeof node !== 'object') return;
    const deps = node.dependencies || {};
    for (const [depKey, depNode] of Object.entries(deps)) {
      // 1) 키로 우선 식별
      if (depKey === targetName && depNode && depNode.version) {
        out.add(depNode.version);
      }
      // 2) 혹시 모를 구조차에 대비해 depNode.name 도 검증
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
  // 자기 메이저
  const selfPkg = readJson(path.resolve(__dirname, '..', 'package.json'));
  const selfVer = String(selfPkg.version || '0.0.0');
  const selfMajor = Number(selfVer.split('.')[0] || 0);

  // 설치를 시작한 루트
  const rootCwd = process.env.INIT_CWD || process.cwd();

  // ✨ 필터 없이 전체 트리 받기
  const raw = run('npm ls --all --json', rootCwd);
  const tree = parseJsonSafe(raw);
  if (!tree) {
    console.error('[postinstall] cannot parse npm ls output');
    process.exit(1);
  }

  const versions = collectAllVersions(tree, TARGET);
  if (versions.length === 0) {
    console.error(`[postinstall] ${TARGET} not found anywhere (require major ${selfMajor} to match ${selfPkg.name}@${selfVer})`);
    process.exit(1);
  }

  // 자신의 메이저와 다르면 실패
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