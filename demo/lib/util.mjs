import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT   = join(__dirname, '..', '..')
export const PUBLIC = join(__dirname, '..', 'public')

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map':  'application/json; charset=utf-8',
    '.br':   'application/brotli',
}

export let esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

let readBody = (req) => new Promise((resolve) => { let b = ''; req.on('data', (c) => b += c); req.on('end', () => resolve(b)) })

// Minimal multipart/form-data parser for text fields (handles what fixi's default
// FormData body sends). Falls through to URLSearchParams for x-www-form-urlencoded
// and parses application/json so rexi can post plain objects.
let parseMultipart = (body, boundary) => {
    let params = new URLSearchParams()
    for (let part of body.split('--' + boundary)) {
        let hdrEnd = part.indexOf('\r\n\r\n')
        if (hdrEnd < 0) continue
        let headers = part.slice(0, hdrEnd), content = part.slice(hdrEnd + 4).replace(/\r\n$/, '')
        let m = headers.match(/name="([^"]+)"/)
        if (m) params.append(m[1], content)
    }
    return params
}

export let parseForm = async (req) => {
    let body = await readBody(req)
    let ct = req.headers['content-type'] || ''
    if (ct.includes('application/json')) {
        try { return new URLSearchParams(Object.entries(JSON.parse(body)).map(([k, v]) => [k, String(v)])) }
        catch { return new URLSearchParams() }
    }
    let m = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/)
    return m ? parseMultipart(body, m[1] || m[2]) : new URLSearchParams(body)
}

export let query = (req) => new URL(req.url, 'http://x').searchParams

export let sendHtml      = (res, html) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html) }
export let sendEmpty     = (res)       => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end('') }
export let sendNoContent = (res)       => { res.writeHead(204); res.end() }
export let sendNotFound  = (res)       => { res.writeHead(404); res.end('not found') }

export let sseStart = (res) => res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':   'keep-alive',
})
export let sseFrame = (event, data) => `event: ${event}\ndata: ${data}\n\n`

export let serveStatic = async (req, res) => {
    let url = req.url.split('?')[0]
    let file = url.startsWith('/dist/') ? join(ROOT, url) : join(PUBLIC, url === '/' ? 'index.html' : url)
    try { await stat(file) } catch { sendNotFound(res); return }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(res)
}
