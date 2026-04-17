import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const mediaDir = path.join(rootDir, 'docs', 'media');

const scenarios = [
  { name: 'dashboard-empty', demo: 'empty' },
  { name: 'dashboard-populated', demo: 'populated' },
  { name: 'dashboard-switching', demo: 'switching' }
];

function run(command, args, extraEnv = {}) {
  const isNpmLike = process.platform === 'win32' && ['npm', 'npx'].includes(command);
  const executable = isNpmLike ? `${command}.cmd` : command;

  const result = spawnSync(executable, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: isNpmLike,
    env: {
      ...process.env,
      ...extraEnv
    }
  });

  if (result.status !== 0) {
    throw new Error(
      `${executable} ${args.join(' ')} failed with exit code ${result.status ?? 'unknown'}${
        result.error ? ` (${result.error.message})` : ''
      }`
    );
  }
}

function getElectronCommand() {
  return path.join(rootDir, 'node_modules', 'electron', 'cli.js');
}

mkdirSync(mediaDir, { recursive: true });

run('npm', ['run', 'build']);

const electronCommand = getElectronCommand();
if (!existsSync(electronCommand)) {
  throw new Error(`Electron binary not found at ${electronCommand}`);
}

for (const scenario of scenarios) {
  const targetPath = path.join(mediaDir, `${scenario.name}.png`);
  run(process.execPath, [electronCommand, '.'], {
    OAUTH_SWITCHER_DEMO_SCENARIO: scenario.demo,
    OAUTH_SWITCHER_SCREENSHOT_FILE: targetPath,
    OAUTH_SWITCHER_AUTOCLOSE_AFTER_CAPTURE: 'true'
  });
}

console.log(`Captured ${scenarios.length} release screenshots in ${mediaDir}`);
