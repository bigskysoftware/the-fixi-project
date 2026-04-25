# 🚲 The Fixi Project

[The Fixi Project](https://fixiproject.org) is a collection of five small web libraries based on other libraries we work
on.

Each library in The Fixi Project is constrained to have an *unminified, uncompressed* source size smaller
than the excellent [Preact](https://preactjs.org) library's [min.gz'd size](https://bundlephobia.com/package/preact) 
(~ 4.7kb).

## The Libraries

The five libraries each provide independent bits of functionality, but are designed to compose well. You can mix and
match them as you see fit.

### 🚲 `fixi.js` - supercharged HTML

`fixi.js` is the original and main library in this collection. It is based on [htmx](https://htmx.org) and, like htmx,
makes it possible to issue HTTP requests from elements in response to events.

Here is a fixi-powered button:

```html
<button fx-action="/like" fx-method="post">
    Like
</button>
```

This button will issue an HTTP POSt to `/like` when it is clicked and will replace itself with whatever HTML content the
server responds with. This simple concept is a surprisingly powerful way to build web applications.

You can read more about how fixi works on its [homepage](https://github.com/bigskysoftware/fixi).

### 🥊 `moxi.js` - inline scripting & simple reactivity

`moxi.js` adds inline scripting and DOM-based reactivity. It is based on [hyperscript](https://hyperscript.org) and lets
you put behavior directly on elements via `on-*` attributes, plus a `live` attribute that re-runs whenever the page
changes.

Here is a moxi-powered button:

```html

<button on-click="this.disabled = true; this.innerText = 'thanks!'">
    Click me
</button>
```

This button disables itself and updates its text when clicked, without a separate `<script>` block. Each `on-*` handler
is compiled into an async function with access to helpers like `q()` (a proxy over a set of matched elements), `trigger()`,
`wait()`, and `debounce()`.

You can read more about how moxi works on its [homepage](https://github.com/bigskysoftware/moxi).

### 📡 `ssexi.js` - streaming HTML & events

`ssexi.js` is a companion library for fixi that
adds [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) support. It is inspired
by [htmx's SSE extension](https://github.com/bigskysoftware/htmx/blob/four/src/ext/hx-sse.js): whenever a fixi
response comes back with `Content-Type: text/event-stream`, ssexi takes over the swap loop and streams each message into
the target as it arrives.

Here is an ssexi-powered log:

```html

<button fx-action="/events" fx-swap="beforeend" fx-target="#log">
    Start
</button>
<div id="log"></div>
```

When `/events` responds with an SSE stream, each `data:` line is appended to `#log`. Messages with a named `event:`
field fire DOM events (`fx:sse:<name>`) instead of swapping, which gives you a clean seam for JavaScript hooks like
progress or "done" signals.

You can read more about how ssexi works on its [homepage](https://github.com/bigskysoftware/ssexi).

### ♻️ `paxi.js` - DOM patching (morphing)

`paxi.js` adds a `morph` swap strategy to fixi. It is based on [idiomorph](https://github.com/bigskysoftware/idiomorph)
and patches an existing subtree into the shape of a new one in place, matching elements by id rather than replacing them
wholesale.

Here is a paxi-powered swap:

```html

<button fx-action="/counter" fx-swap="morph" fx-target="#count">
    Increment
</button>
<span id="count">0</span>
```

When the server responds with an updated `<span id="count">1</span>`, paxi morphs the existing span instead of replacing
the node. The practical upshot is that focus, selection, input state, and event listeners survive a swap. It also allows
you to use CSS transitions.

You can read more about how paxi works on its [homepage](https://github.com/bigskysoftware/paxi).

### 🐕 `rexi.js` - an ergonomic `fetch()` wrapper

`rexi.js` is a small fluent wrapper around `fetch()`, inspired by [hyperscript's
`fetch` command](https://hyperscript.org/commands/fetch/). It handles the usual boring parts of calling an HTTP endpoint
from JavaScript: serializing a form or a plain object as a body, throwing on non-2xx responses, decoding the result, and
aborting on demand.

Here is a rexi-powered POST:

```js
let user = await post('/users', {name: 'carson'}).json()
```

rexi serializes the object as a JSON body, throws if the server returns an error status, and decodes the JSON response
for you. It also accepts `FormData`, `URLSearchParams`, or a form `Element` directly as the body, so it slots neatly
into moxi handlers and fixi-driven pages.

You can read more about how rexi works on its [homepage](https://github.com/bigskysoftware/rexi).

## 🧰 `the-fixi-project.js`

All five libraries are also published as a single pre-concatenated, minified, and brotli-compressed bundle under the [
`the-fixi-project`](https://www.npmjs.com/package/the-fixi-project) npm package:

```html

<script src="https://cdn.jsdelivr.net/npm/the-fixi-project/dist/the-fixi-project.min.js"></script>
```

The entire fixi project comes in at ~4.2kb when brotli-compressed.

## Developing

From a fresh checkout of this repo:

```bash
npm install         # installs playwright + terser (dev-only)
npm run clone       # clones each sub-project repo into its directory
npm test            # runs the full test suite across all libraries (headless)
npm run build       # builds the all-in-one bundle into dist/
npm run serve       # serves the project over http://localhost:8000
```

`npm test` accepts a subset of project names, so `npm test rexi paxi` runs only those two.

## License

BSD-0 (Zero-Clause BSD) across all libraries.
