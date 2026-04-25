# demo

A small Node-backed playground showing what the all-in-one bundle looks like against real
server endpoints.

## Running

From the project root:

```bash
npm run demo
```

This rebuilds `dist/the-fixi-project.js` (so you're always exercising the latest) and starts the
Node server on [http://localhost:8765](http://localhost:8765). No dependencies beyond
Node's standard library; zero framework.

## What's here

| page            | exercises                                                                 |
|-----------------|---------------------------------------------------------------------------|
| `/` (index)     | landing page                                                              |
| `/chat.html`    | fixi + ssexi + moxi - real shared chat over SSE broadcast                 |
| `/bot.html`     | fixi + ssexi + moxi - POST that returns a streaming gibberish response    |
| `/items.html`   | fixi + paxi + moxi - CRUD with bulk delete/toggle, morph-swap updates    |

All three pages load the same `/dist/the-fixi-project.js` and get every library at once.

## Layout

```
demo/
├── server.mjs         # zero-dep Node HTTP server: chat, bot, items CRUD, static
├── public/            # served from /
│   ├── index.html
│   ├── chat.html
│   ├── bot.html
│   └── items.html
└── README.md          # you are here
```

## Endpoints

| route                    | method | purpose                                                 |
|--------------------------|--------|---------------------------------------------------------|
| `/chat/stream`           | GET    | SSE stream of `fx:sse:message` frames, each rendered HTML |
| `/chat/send`             | POST   | broadcast a new chat message to all subscribers          |
| `/bot/ask`               | POST   | POST that returns `text/event-stream` of gibberish tokens |
| `/items`                 | GET    | render the items table as HTML                          |
| `/items`                 | POST   | add an item, return the updated table                   |
| `/items/bulk/delete`     | POST   | delete items whose ids are in the `ids` form field      |
| `/items/bulk/toggle`     | POST   | toggle `done` on items whose ids are in `ids`           |
| `/dist/*`              | GET    | serves the root `dist/` build output (the bundle)       |
| everything else          | GET    | served from `public/`                                   |
