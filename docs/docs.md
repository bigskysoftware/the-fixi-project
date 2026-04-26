---
layout: default
title: Guide - The Fixi Project
heading: '<span class="ico">&#x1F4D6;</span> The Fixi Project Guide'
---

The [fixi project](https://fixiproject.org) is a family of web libraries designed to
work together to make web development more enjoyable.

Each individual library is [constrained](https://quoteinvestigator.com/2014/05/24/art-limit/) to an
_unminified, uncompressed_ source size smaller than (the excellent) [Preact](https://preactjs.com/) library's .min.gz'd
size ([~4.7kb](https://bundlephobia.com/package/preact)).

The full project is ~4.5kb [minified & brotli-compressed](/#all-in-one).

## The Libraries

There are five libraries in the fixi project:

- <span class="ico">&#x1F6B2;</span> [`fixi.js`](fixi.html) - the flagship library, which allows an element to issue an
  HTTP
  request based on any event and place the response HTML anywhere in the DOM.
- <span class="ico">&#x1F94A;</span> [`moxi.js`](moxi.html) - allows you to place scripts for arbitrary events on an
  element,
  and provides helpers for making common scripting needs simpler. Also supports simple DOM-based reactivity.
- <span class="ico">&#x267B;&#xFE0F;</span> [`paxi.js`](paxi.html) - provides morphing functionality, allowing you to
  merge
  new content into the DOM without doing a full swap, which preserves focus, input values, etc.
- <span class="ico">&#x1F4E1;</span> [`ssexi.js`](ssexi.html) - extends `fixi.js` to handle
  streaming [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).
- <span class="ico">&#x1F415;</span> [`rexi`](rexi.html) - Provides ergonomic `fetch()` wrappers that make issuing HTTP
  requests from scripting less painful.

## A fixi Application

A "standard" fixi-powered web application would typically use:

- plain [links](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) for navigation between pages
- fixi for any in-page interactivity that requires server communication
- moxi for any small bits of client-side behavior: open/close, switching tabs, debounced events, enabling elements
- ssexi for live notifications or other content from the server
- paxi for `morph` swaps in fixi when focus & input needs to remain stable
- rexi when scripting-based HTTP requests are needed

The ethos of fixi is: less is more.

Next up: the flagship library, [fixi.js](fixi.html).