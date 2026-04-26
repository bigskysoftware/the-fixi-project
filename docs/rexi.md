---
layout: default
title: rexi.js - The Fixi Project
heading: '<span class="ico">&#x1F415;</span> <code>rexi.js</code>: a fluent fetch'
---

## Overview

`rexi.js` is a tiny fluent wrapper around the browser's `fetch` API.

It is useful when you want to issue HTTP requests in scripting contexts, rather than
in fixi-driven contexts. Where fixi's job is "swap HTML returned by the server", rexi's
job is "make the JSON call you actually need to make from JavaScript".

It exposes six HTTP-verb shortcuts on `globalThis`. Each call returns a decorated
`Promise<Response>` with chainable parsers, so the common case is a single `await`.

Non-2xx responses throw an `Error` carrying `.status` and `.response`.

## Verbs

All six verbs share the same shape: `verb(url, body?, opts?)`.

| verb              | default disposition                              |
|-------------------|--------------------------------------------------|
| `get`, `head`     | URL-encode the body into a query string          |
| `post`, `put`, `patch` | send the body in the request body           |
| `del`             | a stand-in for `delete` (a JS keyword)           |

Override the default with `opts.send: "query" | "body"`.

## Body Normalization

The second argument is a logical "input"; rexi figures out the wire format from its
type:

| input                                                 | sent as                                              |
|-------------------------------------------------------|------------------------------------------------------|
| `FormData`                                            | as-is                                                |
| `HTMLFormElement`                                     | `new FormData(el)`                                   |
| single named input element                            | `FormData` with one `[name, value]` entry            |
| iterable of elements (e.g. moxi `q(...)`)             | `FormData` collecting each element's `[name, value]` |
| plain object                                          | `JSON.stringify`, `Content-Type: application/json`   |
| `string` / `Blob` / `URLSearchParams` / `ArrayBuffer` | passed straight to `fetch`                           |
| `null` / `undefined`                                  | no body                                              |

## Response Helpers

The promise returned by each verb is decorated with chainable parsers, which avoids
the double `await` problem you usually see with `fetch`:

| helper      | returns                                          |
|-------------|--------------------------------------------------|
| `.json()`   | parsed JSON                                      |
| `.text()`   | response text                                    |
| `.html()`   | a `DocumentFragment` parsed via `<template>`     |
| `.blob()`   | a `Blob`                                         |
| `.raw()`    | the raw `Response`                               |
| `.abort()`  | cancels the underlying fetch                     |

## Events

rexi dispatches two `CustomEvent`s on `document` during its lifecycle:

| event         | when                                                                                                   |
|---------------|--------------------------------------------------------------------------------------------------------|
| `rexi:before` | the request is about to be sent. Mutate `evt.detail.cfg = {url, init}` to inject headers, rewrite URLs, etc. Cancelable: `preventDefault()` aborts with `AbortError`. |
| `rexi:after`  | fires for every completed fetch (including non-2xx, before rexi throws). `evt.detail = {cfg, response}`. |

## Examples

Below are some rexi examples, building on fixi and moxi.

### Plain JSON Calls

Fetching the current user, logging in with a form, and posting a new record:

```js
let me = await get("/api/me").json()
await post("/api/login", document.forms.login)   // form element, sent multipart
await post("/api/users", {name: "Ada"})          // plain object, sent as JSON
await get("/search", {q: "hi"})                  // URL-encoded query string
```

The shape is: pick a verb, pass a URL, hand it whatever you have, and `await` the
parser you want.

### Calling rexi From moxi

If a moxi handler needs to call a JSON API it can use rexi.

The handler scope is already async, so `await` works inline:

```html
<button on-click="let r = await post('/api/calc', {x: 3, y: 4}).json()
                  q('next output').innerText = r.total">
    Add
</button>
<output></output>
```

Of course, for something like this we would recommend using `fixi` instead, but we aren't going to judge :)

### Adding Auth Headers Globally

Listen for `rexi:before` on `document` to mutate every outgoing request before it's
sent. This is the right place for auth headers, request-ID injection, or a uniform URL
prefix:

```js
document.addEventListener("rexi:before", (e) => {
    e.detail.cfg.init.headers.Authorization = `Bearer ${getToken()}`
})
```

## Reference

For the full reference (options, `include`, timeouts, abort signals), see the
[rexi README on GitHub](https://github.com/bigskysoftware/rexi/blob/master/README.md).

With rexi covered, all five libraries are on the table. Head to the
[Demo](demo.html) to see them working together.
