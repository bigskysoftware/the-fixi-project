import { esc, sseStart, sseFrame } from '../lib/util.mjs'

let clock = () => {
    let d = new Date(), pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
let metrics = () => {
    let cpu = Math.floor(20 + Math.random() * 60), mem = Math.floor(40 + Math.random() * 40)
    return `<div class="stat"><div class="stat-label">CPU</div><div class="stat-value">${cpu}%</div><div class="bar"><div style="width:${cpu}%"></div></div></div>` +
           `<div class="stat"><div class="stat-label">Memory</div><div class="stat-value">${mem}%</div><div class="bar"><div style="width:${mem}%"></div></div></div>`
}

const LOG_LINES = [
    { kind: '',     m: 'request /api/users 200 14ms' },
    { kind: '',     m: 'cache hit user:42' },
    { kind: '',     m: 'request /api/orders 200 31ms' },
    { kind: '',     m: 'broadcast tick to 17 clients' },
    { kind: 'warn', m: 'slow query users.created_at (218ms)' },
    { kind: '',     m: 'job mailer.dispatch ok' },
    { kind: 'err',  m: 'upstream timeout: /api/inventory' },
    { kind: '',     m: 'request /api/orders 200 22ms' },
    { kind: 'warn', m: 'queue depth 142 (above 100)' },
    { kind: '',     m: 'gc pause 3.1ms' },
]
let logLine = () => {
    let l = LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)]
    return `<div class="line ${l.kind}"><span class="t">${clock()}</span><span class="m">${esc(l.m)}</span></div>`
}

export let stream = (req, res) => {
    sseStart(res)
    // initial paint
    res.write(sseFrame('{"target":"#clock"}',   clock()))
    res.write(sseFrame('{"target":"#metrics"}', metrics()))
    let c = setInterval(() => res.write(sseFrame('{"target":"#clock"}',                  clock())),   1000)
    let m = setInterval(() => res.write(sseFrame('{"target":"#metrics"}',                metrics())), 2000)
    let l = setInterval(() => res.write(sseFrame('{"target":"#log","swap":"beforeend"}', logLine())), 1500)
    req.on('close', () => { clearInterval(c); clearInterval(m); clearInterval(l) })
}
