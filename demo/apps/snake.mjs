import { sseStart, sseFrame } from '../lib/util.mjs'

const W = 20, H = 20, TICK = 220
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' }
const VEC = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }

let listeners = new Set()
let game

let placeFood = (occupied) => {
    let cells = []
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
        if (!occupied.some((s) => s.x === x && s.y === y)) cells.push({ x, y })
    return cells[Math.floor(Math.random() * cells.length)]
}

let resetGame = () => {
    let cx = Math.floor(W / 2)
    let body = [{ x: cx, y: H - 3 }, { x: cx, y: H - 2 }, { x: cx, y: H - 1 }]
    game = { body, dir: 'up', pendingDir: 'up', food: placeFood(body), alive: true, score: 0 }
}

let tick = () => {
    if (!game.alive) return
    if (OPP[game.dir] !== game.pendingDir) game.dir = game.pendingDir
    let v = VEC[game.dir], head = game.body[0]
    let next = { x: head.x + v.x, y: head.y + v.y }
    let ate = next.x === game.food.x && next.y === game.food.y
    let body = ate ? game.body : game.body.slice(0, -1)
    if (next.x < 0 || next.x >= W || next.y < 0 || next.y >= H ||
        body.some((s) => s.x === next.x && s.y === next.y)) {
        game.alive = false
        return
    }
    game.body = [next, ...body]
    if (ate) { game.score++; game.food = placeFood(game.body) }
}

let renderBoard = () => {
    let parts = [`<div class="seg head" style="--x:${game.body[0].x};--y:${game.body[0].y}"></div>`]
    for (let i = 1; i < game.body.length; i++)
        parts.push(`<div class="seg body" style="--x:${game.body[i].x};--y:${game.body[i].y}"></div>`)
    parts.push(`<div class="seg food" style="--x:${game.food.x};--y:${game.food.y}"></div>`)
    return parts.join('')
}
let renderStatus = () => game.alive
    ? '<span class="ok">alive</span>'
    : '<span class="dead">game over &middot; press &#x21BB;</span>'

let frame = () =>
    sseFrame('{"target":"#board"}',  renderBoard()) +
    sseFrame('{"target":"#score"}',  String(game.score)) +
    sseFrame('{"target":"#status"}', renderStatus())

let broadcast = () => { let f = frame(); for (let r of listeners) r.write(f) }

let timer = null
let startLoop = () => {
    if (timer) return
    timer = setInterval(() => {
        tick()
        broadcast()
        if (!listeners.size) { clearInterval(timer); timer = null }
    }, TICK)
}

resetGame()

export let dimensions = { w: W, h: H }

export let stream = (req, res) => {
    sseStart(res)
    // first player after a quiet period gets a fresh game
    if (!listeners.size) resetGame()
    listeners.add(res)
    res.write(frame())
    startLoop()
    req.on('close', () => listeners.delete(res))
}

export let turn = (dir) => {
    if (game.alive && VEC[dir]) game.pendingDir = dir
}

export let restart = () => {
    resetGame()
    broadcast()
}
