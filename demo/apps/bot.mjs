import { esc, sseStart } from '../lib/util.mjs'

const VOCAB = [
    'the', 'a', 'and', 'of', 'in', 'that', 'is', 'it', 'for', 'with', 'attention',
    'transformer', 'vector', 'embedding', 'token', 'latent', 'space', 'context',
    'model', 'neural', 'gradient', 'optimization', 'emerges', 'operates', 'considers',
    'synthesizes', 'minimalist', 'hypermedia', 'recursively', 'moreover', 'however',
    'fundamentally', 'paradigm', 'coherent', 'framework', 'fluidly', 'notably',
    'when', 'where', 'while', 'therefore', 'which', 'arguably', 'ultimately',
    'small', 'dense', 'lean', 'composable', 'elegant', 'obvious', 'not-obvious',
]
let words = (n) => {
    let out = []
    for (let i = 0; i < n; i++) out.push(VOCAB[Math.floor(Math.random() * VOCAB.length)])
    out[out.length - 1] += '.'
    return out
}

export let stream = (req, res, question) => {
    sseStart(res)
    if (!question) { res.end(); return }
    // first frame: the user's question (CSS gives it the "You: " prefix)
    res.write(`data: <div class="you">${esc(question)}</div>\n\n`)
    // then stream the gibberish answer one token per frame
    let ws = words(15 + Math.floor(Math.random() * 25))
    let i = 0
    let timer = setInterval(() => {
        if (i >= ws.length) { clearInterval(timer); res.end(); return }
        res.write(`data: <span class="tok">${esc(ws[i++])} </span>\n\n`)
    }, 60)
    req.on('close', () => clearInterval(timer))
}
