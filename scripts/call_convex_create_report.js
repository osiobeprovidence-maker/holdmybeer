import { spawn } from 'child_process';

const payload = {
  title: 'E2E Node Spawn Test 2',
  description: 'Created via node spawn to avoid PowerShell quoting',
  category: 'Bug',
  severity: 'Low',
  pageUrl: 'https://example.test',
  screenshotStorageId: null,
};

const args = ['/c', 'npx', 'convex', 'run', '--prod', 'api.js:createReport', JSON.stringify(payload)];

const child = spawn('cmd', args, { stdio: 'inherit' });

child.on('exit', (code) => {
  console.log('child exited with code', code);
});
