---
layout: default
title: paxi.js - The Fixi Project
heading: '<span class="ico">&#x267B;&#xFE0F;</span> <code>paxi.js</code>: morphing swaps'
---

## Overview

`paxi.js` is a miniature version of [idiomorph](https://github.com/bigskysoftware/idiomorph).

It swaps HTML into the DOM by *morphing* the old tree to match the new one instead of
replacing it wholesale.

The practical benefit is that focus, caret position, scroll offset, and form state on
elements are preserved when a full swap would blow them away.

## Usage

paxi adds no new attributes of its own. There are two ways to invoke it:

| usage                      | description                                                                                                |
|----------------------------|------------------------------------------------------------------------------------------------------------|
| `fx-swap="morph"`          | when loaded alongside fixi, paxi registers itself as the `morph` swap strategy on any fixi-powered element. |
| `window.morph(target, html)` | the underlying morphing function, callable directly without fixi.                                          |

## Examples

Below are some paxi examples, building on fixi.

### Lossless Form Swap

A panel that reloads from `/profile` while preserving any in-progress input:

```html
<button fx-action="/profile" fx-target="#profile" fx-swap="morph">
    Reload Profile
</button>
<div id="profile">
    <input id="nickname" placeholder="typing something here survives the swap">
    <p id="bio">...</p>
</div>
```

Without `fx-swap="morph"`, the input would be replaced and any in-flight text would be
lost. paxi reconciles the new tree against the existing one, leaving the focused input
untouched.

### Default To Morphing

For an app where most swaps should be lossless, set `morph` as the default swap once
via `fixiCfg`:

```html
<script>
    window.fixiCfg = { swap: "morph" }
</script>
<script src="fixi.js"></script>
<script src="paxi.js"></script>
```

Every fixi request now morphs unless an element overrides it with its own `fx-swap`.

### Standalone Morphing

Outside of fixi, call `window.morph()` directly. The first argument is the element to
morph, the second is the new HTML as a string:

```js
morph(document.getElementById('card'), newHtml)
```

This is handy when you have HTML in hand from somewhere other than a fixi response
(local state, a JSON API, a `WebSocket` message) and want id-keyed reconciliation
without the rest of the request pipeline.

## Reference

For the full reference and the morphing algorithm details, see the
[paxi README on GitHub](https://github.com/bigskysoftware/paxi/blob/master/README.md).

Next up is [`ssexi.js`](ssexi.html), which streams server-sent updates into fixi swaps.
