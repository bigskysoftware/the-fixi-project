---
layout: default
title: Demo - The Fixi Project
heading: Demo App
---

If you want to see (or run) a complete demo app showing what the fixi project can do,
clone the repo and start the [demo server](https://github.com/bigskysoftware/the-fixi-project/blob/master/demo/server.mjs):

```bash
git clone https://github.com/bigskysoftware/the-fixi-project.git
cd the-fixi-project
npm install
npm run clone
npm run demo
```

The demo runs on [http://localhost:8765](http://localhost:8765).

Demos include:

- a contacts CRUD with active search and inline editing (fixi + paxi + moxi)
- a TodoMVC clone (fixi + paxi + moxi)
- a streaming pseudo-AI gibberish-bot (fixi + ssexi + moxi)
- a real shared chat over SSE broadcast (fixi + ssexi + moxi)
- a fanned-out live dashboard (fixi + ssexi)
- a snake game driven by SSE pushes and rexi POSTs (fixi + ssexi + rexi + moxi)
