---
layout: default
title: fixi.js - The Fixi Project
heading: '<span class="ico">&#x1F6B2;</span> <code>fixi.js</code>: turbocharged HTML'
---

## Overview

`fixi.js`(TODO: size) is a miniature version of [htmx](https://htmx.org) and offers similar,
simplified functionality. It makes it possible for any element to issue HTTP requests
in response to any event, and place the response HTML anywhere in the document.

Like htmx, fixi uses attributes to add behaviors to HTML elements.

### A Simple Demo

Here is a fixi-powered button that loads a fragment into a panel:

```html
<button fx-action="/profile" 
        fx-target="#panel" 
        fx-swap="innerHTML">
    Load profile
</button>
<output id="panel"></output>
```

Clicking this button issues a `GET /profile` request & whatever HTML comes back is placed inside `#panel`.

This demonstrates the core idea of fixi: an element issues a request, gets some HTML back & places it somewhere in the DOM.

## Attributes

The five core fixi attributes are:

| attribute | description | default |
| --- | --- | --- |
| `fx-action` | the URL to issue a request to | _required_ |
| `fx-method` | the HTTP verb to use | `GET` |
| `fx-trigger` | the DOM event that fires the request | a sensible value based on element type |
| `fx-target` | a CSS selector for the element to swap into | the element itself |
| `fx-swap` | how to insert the response (`outerHTML`, `innerHTML`, `beforeend`, etc.) | `outerHTML` |

## Events

fixi dispatches a set of events during its lifecycle


| event        | when                                                                                                                                              |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `fx:init`    | just before fixi wires up an element. Cancelable: `preventDefault()` skips this element.                                                          |
| `fx:inited`  | after the element is fully wired up. Does not bubble.                                                                                             |
| `fx:process` | listened for on `document`; processes `evt.target` and its descendants. Dispatch this after manual DOM changes to pick up new fixi-powered nodes. |
| `fx:config`  | the request has been triggered but not yet sent. Mutate `evt.detail.cfg` to inject headers, set a `confirm` callback, rewrite the URL, etc.       |
| `fx:before`  | immediately before `fetch()` is called.                                                                                                           |
| `fx:after`   | the response has arrived, but before the swap.                                                                                                    |
| `fx:swapped` | the response has been swapped in (and any [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) has finished).  |
| `fx:error`   | the `fetch()` threw an exception                                                                                                                  |
| `fx:finally` | after every request, success or failure.                                                                                                          |

The most commonly used events are `fx:config`, to customize the request before it goes
out, and `fx:swapped`, to react to freshly inserted content.

## Modifying The Request Config

Each fixi request is configured through an object exposed on the `fx:config` event's
`evt.detail.cfg`. 

Listening for that event and mutating `cfg` is how you customize a request before it is sent.


| field            | controls                                                        |
|------------------|-----------------------------------------------------------------|
| `cfg.action`     | the URL fixi will fetch                                         |
| `cfg.method`     | the HTTP verb                                                   |
| `cfg.headers`    | a plain object of headers to send                               |
| `cfg.body`       | the request body (`FormData`, string, etc.)                     |
| `cfg.target`     | the element the response will be swapped into                   |
| `cfg.swap`       | the swap mode (`outerHTML`, `innerHTML`, `morph`, etc.)         |
| `cfg.confirm`    | an optional `() => boolean` callback fixi awaits before sending |
| `cfg.transition` | the View Transition function, or `false` to disable             |
| `cfg.fetch`      | the fetch implementation (replace for mocking)                  |

### Per-Element Configuration

Attach an `on-fx:config` handler with [moxi](moxi.html) (or a plain `addEventListener`)
to customize a single element's requests.

moxi exposes every key on `event.detail` as a bare name, so `cfg` resolves directly:

```html
<button fx-action="/things/42" fx-method="DELETE"
        on-fx:config="cfg.confirm = () => confirm('Delete this thing?')">
    delete
</button>
```

### Global Configuration

Listen on `document` to apply the same modification to every fixi request. This is the
right place for auth headers, request-ID injection, or a uniform URL prefix:

```js
document.addEventListener('fx:config', (e) => {
    e.detail.cfg.headers.Authorization = `Bearer ${getToken()}`
})
```

### Default Configuration via `window.fixiCfg`

For values you want to set once at page load, fixi reads `window.fixiCfg` for default
`swap`, `transition`, and `headers`:

```html
<script>
    window.fixiCfg = {
        swap: "morph",
        headers: { "X-CSRF-Token": "abc123" },
    }
</script>
<script src="fixi.js"></script>
```

Per-element listeners always win over these defaults.

## Examples

Below are some fixi-only examples to show what you can do with it.

### Inline Editing

A common fixi pattern is to click a row (or div) and to swap in an edit form, then submit to swap back to a
display row. 

Both of these are plain fixi swaps:

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

The server returns either the display row or the edit form depending on the URL. The
edit form posts back to the same row id; the response replaces it with a fresh display
row. 

### Lazy Loading

Any fixi event can be used as an `fx-trigger`, including the `fx:init` event that fires
when fixi wires an element up. 

That makes a "load this content asynchronously" simple to implement:

```html
<div fx-action="/expensive-data"
     fx-trigger="fx:init">
    loading...
</div>
```

When fixi initializes the div it dispatches `fx:init` the element issues `GET /expensive-data`, and the response 
replaces the element.

## Reference

For a complete fixi.js reference see the [README on GitHub](https://github.com/bigskysoftware/fixi/blob/master/README.md).

Next up is [`moxi.js`](moxi.html), which makes fixi much more powerful.