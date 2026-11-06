#!/usr/bin/env node
/**
 * Copies the icons listed in src/data/aws-icons.json out of the official AWS
 * Architecture Icons package, byte for byte, and records each file's SHA-256.
 *
 * Usage: npm run icons:import -- /path/to/Icon-package.zip
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'src/data/aws-icons.json');
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

const packagePath = process.argv[2];
if (!packagePath) {
  console.error('Usage: npm run icons:import -- /path/to/Icon-package.zip');
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const packageHash = sha256(await readFile(packagePath));
if (packageHash !== manifest.packageSha256) {
  console.warn(`Package hash differs from the manifest. Recording new hash: ${packageHash}`);
  manifest.packageSha256 = packageHash;
}

for (const [id, icon] of Object.entries(manifest.icons)) {
  const { stdout } = await run('unzip', ['-p', packagePath, icon.source], {
    encoding: 'buffer',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (stdout.length === 0) throw new Error(`Not found in package: ${icon.source}`);

  const file = `/aws-icons/${icon.category}/${basename(icon.source)}`;
  await mkdir(dirname(join(root, 'public', file)), { recursive: true });
  await writeFile(join(root, 'public', file), stdout);
  icon.file = file;
  icon.sha256 = sha256(stdout);
  console.log(`${id} -> ${file}`);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
