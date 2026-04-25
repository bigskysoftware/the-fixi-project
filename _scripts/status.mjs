import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sh = (cmd) => { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null } }
const fetchPublished = (pkg, version, path) => version ? sh(`curl -sf https://unpkg.com/${pkg}@${version}/${path}`) : null

const rootPkg = JSON.parse(readFileSync(`${ROOT}/package.json`, 'utf8'))

const ENTRIES = [
    ['fixi-js',     'fixi/fixi.js',              'fixi.js'],
    ['moxi-js',     'moxi/moxi.js',              'moxi.js'],
    ['ssexi-js',    'ssexi/ssexi.js',            'ssexi.js'],
    ['paxi-js',    'paxi/paxi.js',            'paxi.js'],
    ['rexi-js',     'rexi/rexi.js',              'rexi.js'],
    [rootPkg.name,  'dist/the-fixi-project.js',  'dist/the-fixi-project.js', rootPkg.version],
]

console.log('package         published    release?')
console.log('--------------- ------------ --------')

for (const [pkg, localPath, remotePath, localVersion] of ENTRIES) {
    const local = readFileSync(`${ROOT}/${localPath}`, 'utf8')
    const version = sh(`npm view ${pkg} version`) || ''
    const published = fetchPublished(pkg, version, remotePath)
    let status
    if (!version) status = 'yes (unpublished)'
    else if (published == null) status = '? (fetch failed)'
    else if (published !== local) status = 'yes (source differs)'
    else if (localVersion && localVersion !== version) status = `yes (local ${localVersion})`
    else status = 'no'
    console.log(`${pkg.padEnd(15)} ${(version || '-').padEnd(12)} ${status}`)
}