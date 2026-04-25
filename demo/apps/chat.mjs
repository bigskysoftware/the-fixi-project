import { esc, sseStart } from '../lib/util.mjs'

let listeners = new Set()
let history = []
let renderMsg = (m) => `<div class="msg"><strong>${esc(m.name)}</strong>: ${esc(m.text)} <small>${m.at}</small></div>`

export let send = (name, text) => {
    let msg = {
        name: (name || 'anon').slice(0, 40),
        text: (text || '').slice(0, 400),
        at:   new Date().toLocaleTimeString(),
    }
    history.push(msg)
    if (history.length > 50) history.shift()
    let payload = renderMsg(msg)
    for (let r of listeners) r.write(`data: ${payload}\n\n`)
}

export let stream = (req, res) => {
    sseStart(res)
    for (let m of history) res.write(`data: ${renderMsg(m)}\n\n`)
    listeners.add(res)
    req.on('close', () => listeners.delete(res))
}
