import { spawnSync } from 'node:child_process'

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(command, ['vite', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_ENABLE_MOCKS: 'true' },
})
process.exit(result.status ?? 1)
