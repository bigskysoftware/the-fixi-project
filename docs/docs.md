---
layout: default
title: Docs - The Fixi Project
---

[&larr; back](index.html)

# <span class="ico">&#x1F6B2;</span> The Fixi Project Docs

## Intro

The [fixi project](https://fixiproject.org) is a family of web libraries designed to
work together to make web development more enjoyable while remaining intentionally
small. 

Each library has its own repository with a full README, a runnable test suite,
and a small source file, most of which you can read and understand completely in a
few minutes (moxi.js is a little dense and may take a bit longer).

The entire fixi project is ~4.5kb in size.

## Installing

See the [index page](index.html#installing) for installation instructions.

## The Libraries

The fixi project consists of five libraries:

- <span class="ico">&#x1F6B2;</span> [`fixi`](https://github.com/bigskysoftware/fixi) - the flagship library of the
  fixi project, which supercharges your HTML by allowing any element to issue HTTP requests
- <span class="ico">&#x1F94A;</span> [`moxi`](https://github.com/bigskysoftware/moxi) - a library that allows you to
  write
  powerful inline scripts directly on elements, including lightweight DOM-based reactivity
- <span class="ico">&#x1F4E1;</span> [`ssexi`](https://github.com/bigskysoftware/ssexi) - provides streaming HTML &
  server sent events for fixi.js
- <span class="ico">&#x267B;&#xFE0F;</span> [`paxi`](https://github.com/bigskysoftware/paxi) - provides a DOM
  patching/morphing function & a `morph` swap for fixi.js
- <span class="ico">&#x1F415;</span> [`rexi`](https://github.com/bigskysoftware/rexi) - provides a set
  of ergonomic `fetch()` wrappers (`get()`, `post()`, etc) to make issuing one-off HTTP requests nicer.

The libraries all compose together to form a powerful set of tools for building interactive web applications.

Let's look at each one and then how they can be used together.

### <span class="ico">&#x1F6B2;</span> `fixi.js`: turbocharged HTML {#fixi}

`fixi.js` is a miniature version of [htmx](https://htmx.org) and offers similar, simplified
functionality. It makes it possible for any element to issue HTTP requests in response
to any event, and place the response HTML anywhere in the document.

Like htmx, fixi uses attributes to add behaviors to HTML elements.

The five core fixi attributes are:

- `fx-action`: the URL to issue a request to (required)
- `fx-method`: the HTTP verb to use (defaults to `GET`)
- `fx-trigger`: the DOM event that fires the request (defaults to a reasonable value based on the element type)
- `fx-target`: a CSS selector for the element to swap into (defaults to the element itself)
- `fx-swap`: how to insert the response (`outerHTML`, `innerHTML`, `beforeend`, etc. defaults `outerHTML`).

#### Example

Here is a fixi-powered button that loads a fragment into a panel:

```html

<button fx-action="/profile" fx-target="#panel" fx-swap="innerHTML">
    Load profile
</button>
<output id="panel"></output>
```

Clicking this button issues a `GET /profile` request & whatever HTML comes back is placed inside
`#panel`. This is the core idea of fixi: an element issues a request, gets some HTML back & places it somewhere in the
DOM.

It's a pretty simple concept, but can be surprisingly powerful, as you'll see in the examples section.

If you want all the gory details on `fixi.js` you can read
the [README.md](https://github.com/bigskysoftware/fixi/blob/master/README.md)

### <span class="ico">&#x1F94A;</span> `moxi.js`: inline scripting {#moxi}

`moxi.js` is a miniature version of [hyperscript](https://hyperscript.org) and offers
similar though much simplified functionality. It lets you put small bits of behavior (event handlers,
reactive expressions, and a compact query helper) directly on HTML elements as attributes.

Like hyperscript, moxi uses attributes to add behaviors to HTML elements.

There are two types of moxi attributes:

- `on-<event>`: binds a handler for `<event>` on this element. The body is plain JavaScript (e.g.
  `on-click="this.count++"`)
- `live`: a reactive program that is re-evaluated whenever the DOM or form state changes

To make inline scripting more efficient, moxi includes some helpers in scripts:

- `q(x)`: a sophisticated query mechanism that allows you to look elements up and apply bulk operations to them easily
- `trigger(name, detail, bubbles?)`: dispatches an event on the current element
- `wait(x)`: allows you to wait `x` milliseconds, or for when an event named `x` fires on the current element
- `debounce(ms)`: allows you to [debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) event handling
- `transition(fn)`: allows you to wrap some code in
  a [view transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- `take(cls, from, to)`: allows you to take a given CSS class from a set of elements for another element

#### Example

Here is a moxi-powered input that updates an output as you type, with a button that clears it:

```html
<input id="name" placeholder="type your name">
<output live="this.innerText = q('#name').value ? 'hello ' + q('#name').value : ''"></output>
<button on-click="q('#name').value = ''">clear</button>
```

The `live` expression on the `<output>` re-runs every time the input fires `input` or
`change`, so the greeting tracks what you type.

The button's `on-click` handler clears the input via the same `q()` helper.

With moxi, behavior lives next to the markup it acts on, the DOM is
the state, and a tiny set of helpers keeps the syntax close to plain JavaScript.

If you want all the gory details on `moxi.js` you can read
the [README.md](https://github.com/bigskysoftware/moxi/blob/master/README.md)

### <span class="ico">&#x1F4E1;</span> `ssexi.js`: server-sent events {#ssexi}

`ssexi.js` is a small companion to fixi that adds
[Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
support: a long-lived HTTP stream where the server pushes HTML to the browser as things
happen.

ssexi adds no new attributes of its own. It hooks into fixi's request lifecycle and
treats any response with `Content-Type: text/event-stream` as a live stream, swapping each
incoming message into `fx-target` using `fx-swap`.

#### Example

Here is a div that subscribes to a `/feed` stream and appends to its inner contents with each new message:

```html

<div fx-trigger="fx:init" fx-action="/feed" fx-swap="beforeend"></div>
```

When the server emits a `data:` line, ssexi swaps the data into the div.

By default one stream feeds one target. If you need a single stream to drive several parts of the page,
the server can name an event with a JSON object instead of a plain word:

```
event: {"target":"#sidebar","swap":"innerHTML"}
data: <ul>...</ul>

event: {"target":"#feed","swap":"beforeend"}
data: <article>...</article>
```

ssexi parses the event name as JSON, looks up the target, and swaps using the named
strategy.

Plain (non-JSON) event names just fire as ordinary DOM events on the subscribing element, so moxi handlers like
`on-my-event` can react to them too.

If you want more details on `ssexi.js` you can read the [README.md](https://github.com/bigskysoftware/ssexi/blob/master/README.md)

### <span class="ico">&#x267B;&#xFE0F;</span> `paxi.js`: morphing swaps {#paxi}

`paxi.js` is a miniature version of [idiomorph](https://github.com/bigskysoftware/idiomorph). 

It swaps HTML into the DOM by *morphing* the old tree to match the new one instead of replacing it wholesale.

The practical benefit of this is that focus, caret position, scroll offset, and form state on
elements is preserved when a full swap would blow them away.

paxi adds no new attributes of its own. When loaded alongside fixi, it registers itself
as the `morph` swap strategy, so you can write `fx-swap="morph"` and get id-keyed
reconciliation out of the box. It also works on its own via the `window.morph(target, html)`
global.

#### Example

Here is a panel that reloads from `/profile` while preserving any in-progress input:

```html
<button fx-action="/profile" fx-target="#profile" fx-swap="morph">
    Reload Profile
</button>
<div id="profile">
    <input id="nickname" placeholder="typing something here survives the swap">
    <p id="bio">...</p>
</div>
```

If you want more details on `paxi.js` you can read
its [README.md](https://github.com/bigskysoftware/paxi/blob/master/README.md)

### <span class="ico">&#x1F415;</span> `rexi.js`: a fluent fetch {#rexi}

`rexi.js` is a tiny fluent wrapper around the browser's `fetch` API.

It is useful when you want to issue HTTP requests in scripting contexts, rather than in fixi contexts.

It exposes six HTTP-verb shortcuts on `globalThis`:

- `get`, `head`: URL-encode the body into a query string by default
- `post`, `put`, `patch`: send the body in the request body
- `del`: a stand-in for `delete`

All six share the same shape: `verb(url, body?, opts?)`.

The second argument is a logical "input" and rexi figures out the right wire format from its type:

- `FormData`, an `HTMLFormElement`, a named input, or any iterable of inputs becomes a multipart form
- a plain object becomes a JSON body with `Content-Type: application/json`
- a `string` / `Blob` / `URLSearchParams` / `ArrayBuffer` passes straight through to `fetch`
- `null` or `undefined` means no body

Each call returns a decorated `Promise<Response>` with chainable parsers, which avoids the double `await` problem
you often see with fetch:

- `.json()`: parsed JSON
- `.text()`: response text
- `.html()`: a `DocumentFragment` parsed via a `<template>`
- `.blob()`, `.raw()`, `.abort()`

Non-2xx responses throw an `Error` carrying `.status` and `.response`.

#### Example

Fetching the current user, logging in with a form, and posting a new record:

```js
let me = await get("/api/me").json()
await post("/api/login", document.forms.login)   // form element, sent multipart
await post("/api/users", {name: "Ada"})          // plain object, sent as JSON
await get("/search", {q: "hi"})                  // URL-encoded query string
```

The shape is: pick a verb, pass a URL, hand it whatever you have, and `await` the parser you want.

If you want more details on `rexi.js` you can read
the [README.md](https://github.com/bigskysoftware/rexi/blob/master/README.md)

## Using Them All Together

A fixi project based application would typically use:

- normal links for navigation between pages
- fixi for within-page interactivity
- moxi for the small bits of local behavior: open/close, switching tabs, debounced events, enabling elements
- ssexi for live notifications or other content from the server
- paxi `morph` swaps when focus & input needs to remain stable
- rexi for the one or two endpoints that genuinely need JSON

Less is more.

### fixi + moxi: lifecycle hooks and imperative triggers

moxi picks up fixi's lifecycle events with ordinary `on-*` handlers, which is the right
place to hang per-element behavior: a confirm before a delete, a class flip after a
swap, a header injected into the request.

```html
<button fx-action="/things/42" fx-method="DELETE"
        on-fx:config="cfg.confirm = () => confirm('Delete?')">
    delete thing
</button>
```

Going the other way, a moxi handler can fire a custom event that a fixi element is
listening for:

```html
<button on-click="q('#feed').trigger('refresh')">refresh</button>
<div id="feed" fx-action="/feed" fx-trigger="refresh"></div>
```

### fixi + ssexi: server-pushed updates

ssexi piggybacks on every fixi attribute you already use; the only thing that changes is
the server's content type. 

A live feed:

```html
<ul id="feed"
    fx-trigger="fx:init"
    fx-action="/feed"
    fx-swap="beforeend"></ul>
```

The server responds with `text/event-stream` and emits one `data: <li>...</li>` per push.

### fixi + paxi: lossless swaps

Add `fx-swap="morph"` to any fixi-driven swap that contains in-progress UI (focused
inputs, scrolled regions, partially-filled forms) and paxi reconciles the trees so user
state survives the swap.

You can opt every fixi request into morphing globally via fixi's `fixiCfg`:

```js
window.fixiCfg = {swap: "morph"}
```

### moxi + rexi: when you actually need JSON

If a moxi handler needs to call a JSON API, drop into rexi. The handler scope is already
async, so `await` works inline:

```html
<button on-click="let r = await post('/api/calc', {x: 3, y: 4}).json()
                  q('next output').innerText = r.total">
  Add
</button>
<output></output>
```

## Common Patterns

A short cookbook of recipes that recur across most apps. Most use only one or two libraries.

### Debounced Active Search

A search input that fires a fixi request only after the user pauses typing. moxi's
`debounce` helper waits for a quiet moment, then `trigger('search')` dispatches the same
event the input is itself listening for via `fx-trigger`:

```html
<input id="q" name="q" placeholder="search"
       fx-action="/search"
       fx-trigger="search"
       fx-target="#results"
       on-input="await debounce(250); trigger('search')">
<div id="results"></div>
```

Each keystroke schedules a `search` event 250ms in the future; subsequent keystrokes
supersede the previous timer, so only the final one actually fires. fixi then issues
`GET /search?q=...` (the input's own `name=q` is picked up automatically) and swaps the
response into `#results`.

### Inline Editing

Click a row to swap in an edit form; submit to swap back to a display row. Both swaps
are plain fixi:

```html
<tr id="row-42">
    <td>Ada</td>
    <td>
        <button fx-action="/contacts/42/edit"
                fx-target="#row-42"
                fx-swap="outerHTML">edit</button>
    </td>
</tr>
```

The server returns either the display row or the edit form depending on the URL. Pair
with `fx-swap="morph"` (paxi) so any focused input or scroll position outside the row
isn't disturbed.

### Confirm Before Delete

moxi listens for fixi's `fx:config` event and sets `cfg.confirm`:

```html
<button fx-action="/things/42" fx-method="DELETE"
        on-fx:config="cfg.confirm = () => confirm('Delete?')">
    delete
</button>
```

fixi pauses the request long enough to call `cfg.confirm()`; if it returns false, the
request is aborted.

### Click-Outside-to-Dismiss

moxi's `.outside` modifier attaches the listener to `document` and fires only when the
event target is outside the element:

```html
<button on-click.stop="q('#menu').hidden = false">open menu</button>
<div id="menu" hidden on-click.outside="this.hidden = true">menu items...</div>
```

The `.stop` on the opener keeps that click from immediately re-dismissing the menu.

### Active Tab

moxi's `take(cls, from, to)` helper moves a class from one element to another in one line:

```html
<nav>
    <button class="tab active" on-click="take('active', '.tab', this)">One</button>
    <button class="tab"        on-click="take('active', '.tab', this)">Two</button>
    <button class="tab"        on-click="take('active', '.tab', this)">Three</button>
</nav>
```

### Server-Pushed List Updates

ssexi appending to a list, one line per push:

```html
<ul id="notifications"
    fx-trigger="fx:init"
    fx-action="/notifications/stream"
    fx-swap="beforeend"></ul>
```

The server streams `data: <li>...</li>` events; ssexi appends each one as it arrives.

## Demo App

If you want to see (or run) a complete demo app showing what the fixi project can do,
clone the repo and start the [demo server](https://github.com/bigskysoftware/the-fixi-project/blob/master/demo/server.mjs):

```bash
git clone https://github.com/bigskysoftware/the-fixi-project.git
cd the-fixi-project
npm install
npm run demo
```

The demo runs on [http://localhost:8765](http://localhost:8765). 

Demos include:

- a contacts CRUD with active search and inline editing (fixi + paxi + moxi)
- a TodoMVC clone (fixi + paxi + moxi)
- a streaming gibberish-bot (fixi + ssexi + moxi)
- a real shared chat over SSE broadcast (fixi + ssexi + moxi)
- a fanned-out live dashboard (fixi + ssexi)
- a snake game driven by SSE pushes and rexi POSTs (fixi + ssexi + rexi + moxi)