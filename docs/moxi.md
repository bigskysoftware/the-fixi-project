---
layout: default
title: moxi.js - The Fixi Project
heading: '<span class="ico">&#x1F94A;</span> <code>moxi.js</code>: inline scripting'
---

## Overview

`moxi.js` is the client-side scripting component of the fixi project, helping you write client-side enhancements to
your fixi-based applications. Like `fixi.js`, moxi focuses on using attributes to add behaviors to HTML elements.

`moxi.js` can be used independently from `fixi.js`, but the two dovetail nicely.

## Attributes

There are two types of moxi attributes:

| attribute    | description                                                          |
|--------------|----------------------------------------------------------------------|
| `on-<event>` | Executes JavaScript when the given `<event>` occurs on this element. |
| `live`       | JavaScript that is re-evaluated when the DOM or form state changes.  |

## Modifiers

`on-<event>` handlers can chain modifiers, separated by dots. For example,
`on-click.prevent.stop="..."` calls `preventDefault()` and `stopPropagation()` before
the handler body runs.

| modifier   | description                                                                                                             |
|------------|-------------------------------------------------------------------------------------------------------------------------|
| `.prevent` | calls `event.preventDefault()` before the handler runs                                                                  |
| `.stop`    | calls `event.stopPropagation()` before the handler runs                                                                 |
| `.halt`    | shorthand for `.prevent.stop`                                                                                           |
| `.once`    | removes the listener after the first successful fire                                                                    |
| `.self`    | skips bubbled events from children (`event.target !== this`)                                                            |
| `.capture` | passes `{capture: true}` to `addEventListener`                                                                          |
| `.passive` | passes `{passive: true}` to `addEventListener`                                                                          |
| `.outside` | attaches the listener to `document`; fires only when the event happened outside the element                             |
| `.cc`      | camel-cases the event name (`on-my-event.cc` listens for `myEvent`); useful for camelCase events from web components    |

## Scripting Helpers

To make scripting more pleasant, moxi exposes a few global helpers:

| helper           | description                                                                                                                            |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `q(x)`           | A query mechanism. `x` can be a CSS selector, an `Element`, or any iterable of elements.                                               |
| `wait(x)`        | returns a Promise that resolves after `x` milliseconds (when `x` is a number) or when an event named `x` fires (when `x` is a string). |
| `transition(fn)` | wraps `fn` in a [view transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) if available.                  |

`q()` also supports relative selectors like `next div` and `li in this`.

### The `q()` Proxy

`q()` returns a proxy object with useful features for working with sets of elements:

| method                                   | description                                        |
|------------------------------------------|----------------------------------------------------|
| `q(...).trigger(name, detail, bubbles?)` | dispatch a `CustomEvent` from every match          |
| `q(...).take(cls, from)`                 | take CSS class `cls` from elements matching `from` |
| `q(...).insert(pos, html)`               | parse and insert HTML at every match               |
| `q(...).count`                           | the count of matches                               |
| `q(...).arr()`                           | converts the proxy to an array                     |

In addition, you can iterate naturally over results from `q()` and, like jQuery, properties and methods can be invoked on all elements in the collection.

### Handler-Scope Helpers

Inside `on-*` and `live` handler bodies, two extra functions are in scope:

| helper                            | description                                                                                         |
|-----------------------------------|-----------------------------------------------------------------------------------------------------|
| `trigger(name, detail, bubbles?)` | dispatches a `CustomEvent` from `this`. To dispatch from another element use `q(elt).trigger(...)`. |
| `debounce(ms)`                    | debounces the current handler; if it is invoked again within `ms` it will not execute.              |

Note that `q()` directionals (`next`, `prev`, `closest`, `in this`) and `wait("event")`
are context-aware: in a handler they resolve relative to `this`; called globally they
resolve relative to `document.documentElement`.

Note also that all fields on the `event.detail` object will be unpacked into top level scope.  This is particularly
useful when working with fixi's events.

## Examples

Below are some moxi examples, many showing how well it composes with `fixi.js`.

### A Simple Greeting

Here is a moxi-powered input that updates an output as you type, with a button that
clears it:

```html
<input id="name" placeholder="type your name">
<output live="this.innerText = q('#name').value ? 'hello ' + q('#name').value : ''"></output>
<button on-click="q('#name').value = ''">clear</button>
```

The `live` expression on the `<output>` re-runs every time the input fires `input` or
`change`, so the greeting tracks what you type.

The button's `on-click` handler clears the input via the same `q()` helper.

### Disable Submit Until Valid

This is the signup form from the [fixi page](fixi.html#form-submission), with the
submit button now staying disabled until every required field passes HTML validation:

```html
<form fx-action="/signup" fx-method="POST"
      fx-target="#status" fx-swap="innerHTML">
    <input name="email" type="email" required placeholder="email">
    <input name="password" type="password" required minlength="8" placeholder="password">
    <button type="submit" live="this.disabled = !q('closest form').checkValidity()">
        Sign up
    </button>
</form>
<output id="status"></output>
```

The `live` expression re-runs whenever any `input` or `change` fires on the page, so
the button updates in real time without manual event wiring.

`q('closest form')` walks up from the button to its containing form, so the same
handler works in any form.

### Master Checkbox

A master checkbox that mirrors a group of subordinate checkboxes: checked when every
match is checked, indeterminate when some are, unchecked when none are. Clicking the
master propagates its state to every subordinate.

```html
<input type="checkbox" id="select-all" checked
       live="let b=q('.pick').arr();
             let n=b.filter(x=>x.checked).length;
             this.checked=n===b.length;
             this.indeterminate=n>0&&n<b.length"
       on-click="for (let x of q('.pick')) x.checked=this.checked">
```

The `live` expression re-runs on every `input`/`change` anywhere on the page, so
toggling any single `.pick` keeps the master in sync. The `on-click` handler walks
the subordinates and sets each one's `.checked` to the master's, giving select-all /
deselect-all behavior in one line.

### Confirm Before Delete

moxi handlers can be used to listen for fixi's lifecycle events. 

Setting `cfg.confirm` on an `fx:config` event tells fixi to pause the request long enough to call the function,
and abort if it returns false:

```html

<button fx-action="/things/42" fx-method="DELETE"
        on-fx:config="cfg.confirm = () => confirm('Delete?')">
    delete
</button>
```

Here you can see the `cfg` object is exposed directly because moxi unpacks `event.detail` keys into scope.

### Active Tab

`q().take(cls, from)` moves a CSS class from one element to another in one line, which
is exactly what an active-tab indicator wants:

```html

<nav>
    <button class="tab active" on-click="q(this).take('active', '.tab')">One</button>
    <button class="tab" on-click="q(this).take('active', '.tab')">Two</button>
    <button class="tab" on-click="q(this).take('active', '.tab')">Three</button>
</nav>
```

Each button takes the `active` class away from its siblings and onto itself.

### Click-Outside-to-Dismiss

The `.outside` modifier attaches the listener to `document` and fires only when the
event target is outside the element, which is exactly the behavior a dismissable menu
or popover wants:

```html
<button on-click.stop="q('#menu').hidden = false">open menu</button>
<div id="menu" hidden on-click.outside="this.hidden = true">menu items...</div>
```

The `.stop` on the opener keeps the click that opened the menu from immediately
re-dismissing it.

### Triggering A fixi Request

A moxi handler can fire a custom event that a fixi element is listening for, which is
how you wire one element's interaction to another element's request:

```html
<button on-click="q('#feed').trigger('refresh')">refresh</button>
<div id="feed" fx-action="/feed" fx-trigger="refresh"></div>
```

The `#feed` div's `fx-trigger="refresh"` makes it listen for the `refresh` event; the
button dispatches that event from the div and fixi issues the request.

### Debounced Active Search

A search input that fires a fixi request only after the user pauses typing. moxi's
`debounce` helper waits for a quiet moment, then `trigger('search')` dispatches the
same event the input is itself listening for via `fx-trigger`:

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
`GET /search?q=...` (the input's own `name=q` is picked up automatically) and swaps
the response into `#results`.

### Polling

moxi's `on-init` runs once when the element is wired up, and because handlers are
async, an infinite loop with `await wait(...)` gives you a polling timer in two lines:

```html

<div id="status"
     fx-action="/status"
     fx-trigger="poll"
     fx-swap="innerHTML"
     on-init="while (this.isConnected) { trigger('poll'); await wait(2000); }">
    loading...
</div>
```

`trigger('poll')` dispatches the `poll` event on the div (in a handler `trigger`
resolves to `this`), which fixi's `fx-trigger="poll"` picks up to issue the request.

Gating the loop on `this.isConnected` lets it bail cleanly when the element is
replaced or removed, so the timer doesn't leak past the element's lifetime.

## Reference

For the full attribute and modifier reference, the proxy method table, and lifecycle
events, see the
[moxi README on GitHub](https://github.com/bigskysoftware/moxi/blob/master/README.md).

Next up is [`paxi.js`](paxi.html), which adds lossless DOM swaps to fixi.
