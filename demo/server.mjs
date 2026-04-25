import {createServer} from 'node:http'
import {createRouter} from './lib/router.mjs'
import {render} from './lib/views.mjs'
import {
    parseForm, query,
    sendHtml, sendEmpty, sendNoContent, sendNotFound,
    serveStatic,
} from './lib/util.mjs'

import * as chat from './apps/chat.mjs'
import * as bot from './apps/bot.mjs'
import * as dashboard from './apps/dashboard.mjs'
import * as snake from './apps/snake.mjs'
import * as contacts from './apps/contacts.mjs'
import * as items from './apps/items.mjs'

const PORT = Number(process.env.PORT) || 8765

let router = createRouter()

// --- chat ---`
router.get('/chat.html', (req, res) => sendHtml(res, render('chat/chat')))
router.get('/chat/stream', chat.stream)
router.post('/chat/send', async (req, res) => {
    let p = await parseForm(req)
    chat.send(p.get('name'), p.get('text'))
    sendNoContent(res)
})

// --- bot ---
router.get('/bot.html', (req, res) => sendHtml(res, render('bot/bot')))
router.post('/bot/ask', async (req, res) => {
    let p = await parseForm(req)
    bot.stream(req, res, (p.get('q') || '').trim())
})

// --- dashboard: one SSE stream fanning to #clock, #metrics, #log ---
router.get('/dashboard.html', (req, res) => sendHtml(res, render('dashboard/dashboard')))
router.get('/dashboard/stream', dashboard.stream)

// --- snake ---
router.get('/snake.html', (req, res) => sendHtml(res, render('snake/snake', snake.dimensions)))
router.get('/snake/stream', snake.stream)
router.post('/snake/turn', async (req, res) => {
    snake.turn((await parseForm(req)).get('dir'))
    sendNoContent(res)
})
router.post('/snake/restart', (req, res) => {
    snake.restart();
    sendNoContent(res)
})

// --- contacts: searchable list with inline edit ---
router.get('/contacts.html', (req, res) => sendHtml(res, render('contacts/contacts', {contacts: contacts.all()})))
router.get('/contacts', (req, res) => sendHtml(res, render('contacts/contacts-list', {contacts: contacts.search(query(req).get('q') || '')})))
router.post('/contacts', async (req, res) => {
    let p = await parseForm(req)
    contacts.add({name: p.get('name'), email: p.get('email'), phone: p.get('phone')})
    sendHtml(res, render('contacts/contacts-list', {contacts: contacts.all()}))
})
router.get('/contacts/:id', (req, res, {id}) => {
    let c = contacts.find(id)
    c ? sendHtml(res, render('contacts/contact-row', {c})) : sendNotFound(res)
})
router.get('/contacts/:id/edit', (req, res, {id}) => {
    let c = contacts.find(id)
    c ? sendHtml(res, render('contacts/contact-edit', {c})) : sendNotFound(res)
})
router.put('/contacts/:id', async (req, res, {id}) => {
    let p = await parseForm(req)
    let c = contacts.update(id, {name: p.get('name'), email: p.get('email'), phone: p.get('phone')})
    c ? sendHtml(res, render('contacts/contact-row', {c})) : sendNotFound(res)
})
// empty 200 + outerHTML on the row → row vanishes from the list
router.delete('/contacts/:id', (req, res, {id}) => {
    contacts.remove(id)
    sendEmpty(res)
})

// --- items: TodoMVC-style ---
let itemsTable = () => render('items/items-table', {items: items.all()})
router.get('/items.html', (req, res) => sendHtml(res, render('items/items', {items: items.all()})))
router.get('/items', (req, res) => sendHtml(res, itemsTable()))
router.post('/items', async (req, res) => {
    items.add((await parseForm(req)).get('title'))
    sendHtml(res, itemsTable())
})
router.post('/items/toggle-all', (req, res) => {
    items.toggleAll();
    sendHtml(res, itemsTable())
})
router.post('/items/clear-completed', (req, res) => {
    items.clearCompleted();
    sendHtml(res, itemsTable())
})
router.post('/items/:id/toggle', (req, res, {id}) => {
    items.toggle(id);
    sendHtml(res, itemsTable())
})
router.delete('/items/:id', (req, res, {id}) => {
    items.remove(id);
    sendHtml(res, itemsTable())
})

createServer(async (req, res) => {
    if (await router.handle(req, res)) return
    await serveStatic(req, res)
}).listen(PORT, () => {
    console.log(`fixi-project demo at http://localhost:${PORT}/`)
})
