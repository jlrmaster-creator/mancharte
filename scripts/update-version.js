/**
 * Runs after `npm version <bump>` updates package.json.
 * Syncs the version into sw.js and vite.config.ts
 * so they are included in the version commit.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))

// Update sw.js
const swPath = join(root, 'public', 'sw.js')
let sw = readFileSync(swPath, 'utf-8')
sw = sw.replace(/const VERSION = '.*?'/, `const VERSION = '${version}'`)
writeFileSync(swPath, sw, 'utf-8')

// Update vite.config.ts
const vitePath = join(root, 'vite.config.ts')
let vite = readFileSync(vitePath, 'utf-8')
vite = vite.replace(/__APP_VERSION__: JSON\.stringify\('.*?'\)/, `__APP_VERSION__: JSON.stringify('${version}')`)
writeFileSync(vitePath, vite, 'utf-8')

// Also update the pre-push hook version reference if needed
// Stage all changed files for the version commit
import { execSync } from 'child_process'
execSync(`git add "${swPath}" "${vitePath}"`, { cwd: root })

console.log(`✅ Version synced to sw.js and vite.config.ts: v${version}`)
