// Fails when the name of the company that makes Claude appears anywhere in the
// tracked files, the git history, or the build output. The term is assembled
// from fragments so this file stays clean itself.
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const term = ['an', 'thro', 'pic'].join('');
const pattern = new RegExp(term, 'i');
const failures = [];

function scanText(label, text) {
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (pattern.test(line)) failures.push(`${label}:${i + 1}: ${line.trim().slice(0, 120)}`);
  });
}

function looksBinary(buf) {
  const sample = buf.subarray(0, 8000);
  for (const byte of sample) if (byte === 0) return true;
  return false;
}

// 1. Tracked files.
const tracked = execSync('git ls-files -z', { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of tracked) {
  if (!existsSync(file)) continue;
  const buf = readFileSync(file);
  if (looksBinary(buf)) continue;
  scanText(file, buf.toString('utf8'));
}

// 2. Git history: messages, authors, committers.
try {
  const log = execSync('git log --all --format=%H%n%an%n%ae%n%cn%n%ce%n%B', { encoding: 'utf8' });
  scanText('git log', log);
} catch {
  // No commits yet.
}

// 3. Build output.
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else {
      const buf = readFileSync(p);
      if (!looksBinary(buf)) scanText(p, buf.toString('utf8'));
    }
  }
}
walk('dist');
walk('dist-single');
walk('release');

if (failures.length) {
  console.error(`check:names failed. ${failures.length} occurrence(s):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`check:names passed. Scanned ${tracked.length} tracked files, git history, and build output.`);
