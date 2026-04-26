---
layout: default
title: ssexi.js - The Fixi Project
heading: '<span class="ico">&#x1F4E1;</span> <code>ssexi.js</code>: server-sent events'
---

## Overview

`ssexi.js` is a small companion to fixi that adds
[Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
support: a long-lived HTTP stream where the server pushes HTML to the browser as things
happen.

ssexi adds no new attributes of its own. It hooks into fixi's request lifecycle and
treats any response with `Content-Type: text/event-stream` as a live stream, swapping
each incoming message into `fx-target` using `fx-swap`.

That means every fixi attribute you already use applies; the only thing that changes is
the server's content type.

## Events

ssexi dispatches a set of events on the target element during the stream lifecycle.
All events bubble and are cancelable.

| event                  | when                                                                                                              |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| `fx:sse:open`          | the SSE stream has been detected and is about to start. `preventDefault()` aborts processing.                     |
| `fx:sse:message`       | fired for every SSE message before swapping. `preventDefault()` stops the stream.                                 |
| `fx:sse:swapped`       | after a message's data has been swapped in. Useful for auto-scroll, syntax highlighting, etc.                     |
| `fx:sse:{eventName}`   | fired for messages with a (non-JSON) `event:` field. These messages are not swapped.                              |
| `fx:sse:close`         | the stream has ended normally.                                                                                    |
| `fx:sse:error`         | an error occurred during streaming.                                                                               |

The `event.detail` object includes `cfg` (the fixi config) along with `response`,
`message`, or `error` depending on the event.

## Examples

Below are some ssexi examples, building on fixi.

### Live Feed

A div that subscribes to a `/feed` stream on init and appends each incoming message
to its inner contents:

```html
<div fx-trigger="fx:init" fx-action="/feed" fx-swap="beforeend"></div>
```

The server responds with `text/event-stream` and emits one `data: <p>...</p>` per push.
`fx-swap="beforeend"` appends each fragment as it arrives.

### Routing One Stream To Multiple Targets

By default one stream feeds one target. If a single stream needs to drive several parts
of the page, the server can name an event with a JSON object instead of a plain word:

```
event: {"target":"#sidebar","swap":"innerHTML"}
data: <ul>...</ul>

event: {"target":"#feed","swap":"beforeend"}
data: <article>...</article>
```

ssexi parses the event name as JSON, resolves `target` via `document.querySelector`,
and swaps using the named strategy. Any of `target`, `swap`, and `transition` can be
omitted; they fall back to the values on `cfg`.

Plain (non-JSON) event names fire as ordinary `fx:sse:{name}` events on the subscribing
element, so moxi handlers like `on-fx:sse:done` can react to them.

### Auto-Scrolling Log

Streaming a log to a fixed-height div with a moxi handler that pins the scroll to the
bottom after each swap:

```html
<div id="log"
     fx-trigger="fx:init"
     fx-action="/logs/stream"
     fx-swap="beforeend"
     on-fx:sse:swapped="this.scrollTop = this.scrollHeight"></div>
```

`fx:sse:swapped` fires after each message has been inserted into the DOM, which is
exactly when reading and setting `scrollHeight` gives the right value.

## Reference

For the full event reference, the `cfg.sse` object, reconnection flags, and server-side
examples in Python and Node, see the
[ssexi README on GitHub](https://github.com/bigskysoftware/ssexi/blob/master/README.md).

Next up is [`rexi.js`](rexi.html), which makes `fetch()` more pleasant to work with.
