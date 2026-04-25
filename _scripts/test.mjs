import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PROJECTS = process.argv.slice(2).length ? process.argv.slice(2) : ['fixi', 'moxi', 'ssexi', 'paxi', 'rexi']
const PORT = 8765 + Math.floor(Math.random() * 200)

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', ROOT], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 400))

const browser = await chromium.launch()
let exitCode = 0
try {
    for (const project of PROJECTS) {
        const page = await browser.newPage()
        const pageErrors = []
        page.on('pageerror', (e) => pageErrors.push(e.message))
        try {
            await page.goto(`http://localhost:${PORT}/${project}/test.html`, { waitUntil: 'load', timeout: 10000 })
            let prev = -1, stable = 0
            for (let i = 0; i < 120 && stable < 4; i++) {
                await new Promise((r) => setTimeout(r, 250))
                const total = await page.evaluate(() => {
                    const fixi = document.querySelectorAll('.test.passed, .test.failed').length
                    const moxi = document.querySelectorAll('.pass, .fail').length
                    return fixi + moxi
                })
                if (total === prev) stable++; else { stable = 0; prev = total }
            }
            const { passed, failed, failures } = await page.evaluate(() => {
                const fixiPassed = document.querySelectorAll('.test.passed').length
                const fixiFailed = [...document.querySelectorAll('.test.failed')].map((d) => ({
                    name: d.querySelector('h3')?.textContent.replace(/\s+-\s+run.*$/, '').trim() || '(no h3)',
                    error: d.querySelector('p:last-child')?.textContent || '',
                }))
                const moxiPassed = document.querySelectorAll('.pass').length
                const moxiFailed = [...document.querySelectorAll('.fail')].map((s) => ({
                    name: s.textContent.replace(/^[✗✓]\s*/, '').trim(),
                    error: '',
                }))
                return {
                    passed: fixiPassed + moxiPassed,
                    failed: fixiFailed.length + moxiFailed.length,
                    failures: [...fixiFailed, ...moxiFailed],
                }
            })
            const mark = failed === 0 && passed > 0 ? '✓' : '✗'
            console.log(`${mark} ${project}: ${passed} passed, ${failed} failed`)
            if (failed > 0) {
                for (const f of failures) console.log(`    ✗ ${f.name}${f.error ? `\n      ${f.error}` : ''}`)
                exitCode = 1
            }
            if (pageErrors.length) {
                for (const e of pageErrors) console.log(`    [pageerror] ${e}`)
            }
            if (passed === 0 && failed === 0) {
                console.log(`    (no tests detected: check that ${project}/test.html loaded)`)
                exitCode = 1
            }
        } catch (e) {
            console.log(`✗ ${project}: runner error: ${e.message.split('\n')[0]}`)
            exitCode = 1
        } finally {
            await page.close()
        }
    }
} finally {
    await browser.close()
    server.kill()
}
process.exit(exitCode)
