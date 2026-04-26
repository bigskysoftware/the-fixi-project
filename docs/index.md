---
layout: default
title: The Fixi Project
---

# <span class="ico">&#x1F6B2;</span> The Fixi Project

The fixi project is a collection of small web libraries, each one being a
[lightweight](https://www.youtube.com/watch?v=8BNP126zgPU) take on something else
[we've](https://four.htmx.org/about) built.

Each library is [constrained](https://quoteinvestigator.com/2014/05/24/art-limit/) to an
_unminified, uncompressed_ source size that is smaller than (the excellent)
[Preact](https://preactjs.com/) library's .min.gz'd size
([~4.7kb](https://bundlephobia.com/package/preact)).

The libraries are:

- <span class="ico">&#x1F6B2;</span> [`fixi`](https://github.com/bigskysoftware/fixi)
  <small>(3.4kb raw, 1.2kb brotli)</small> inspired by
  [htmx](https://github.com/bigskysoftware/htmx),
  [supercharges](https://dl.acm.org/doi/fullHtml/10.1145/3648188.3675127) your HTML
- <span class="ico">&#x1F94A;</span> [`moxi`](https://github.com/bigskysoftware/moxi)
  <small>(4.6kb raw, 1.8kb brotli)</small> inspired by
  [hyperscript](https://github.com/bigskysoftware/_hyperscript), provides
  [inline](https://htmx.org/essays/locality-of-behaviour/) scripting and DOM-based reactivity
- <span class="ico">&#x1F4E1;</span> [`ssexi`](https://github.com/bigskysoftware/ssexi)
  <small>(4.1kb raw, 1.4kb brotli)</small> inspired by
  [htmx's SSE extension](https://github.com/bigskysoftware/htmx/blob/four/src/ext/hx-sse.js),
  provides streaming HTML & events for fixi.js
- <span class="ico">&#x267B;&#xFE0F;</span> [`paxi`](https://github.com/bigskysoftware/paxi)
  <small>(1.5kb raw, 0.6kb brotli)</small> inspired by
  [idiomorph](https://github.com/bigskysoftware/idiomorph), provides DOM patching/morphing
  and a `morph` swap for fixi.js
- <span class="ico">&#x1F415;</span> [`rexi`](https://github.com/bigskysoftware/rexi)
  <small>(4.3kb raw, 1.4kb brotli)</small> inspired by
  [hyperscript's `fetch` command](https://hyperscript.org/commands/fetch/), provides a set
  of ergonomic `fetch()` wrappers to make issuing one-off HTTP requests nicer.

## Installing {#installing}

Each library is a single standalone script.

Pick whichever you need and drop it into a page:

<div class="installer">
    <div class="installer-header">
        <label>
            <input type="checkbox" id="install-all" checked
                   live="let b=q('.pick').arr();
                         let n=b.filter(x=>x.checked).length;
                         this.checked=n===b.length;
                         this.indeterminate=n>0&&n<b.length"
                   on-click="for (let x of q('.pick')) x.checked=this.checked">
            select all
        </label>
        <div class="installer-actions">
            <button on-click="let parts=q('.pick').arr().filter(x=>x.checked).map(x=>{
                                  let n=x.dataset.url.split('/').pop().replace(/\.js$/, '');
                                  return `echo &quot;// ${n} @ ${x.dataset.ver}&quot;; curl -s ${x.dataset.url}; echo`
                              }).join('; ');
                              await navigator.clipboard.writeText(`{ ${parts}; } > fixi-distro.js`);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">cat</button>
            <button on-click="let s=q('.pick').arr().filter(x=>x.checked).map(x=>{
                                  let f=x.dataset.url.split('/').pop().replace(/\.js$/, `@${x.dataset.ver}.js`);
                                  return `curl -o ${f} ${x.dataset.url}`
                              }).join('\n');
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">vendor</button>
            <button on-click="let p=q('.pick').arr().filter(x=>x.checked).map(x=>`${x.dataset.pkg}@${x.dataset.ver}`).join(' ');
                              await navigator.clipboard.writeText(`npm install ${p}`);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">npm</button>
            <button on-click="let s=q('.pick').arr().filter(x=>x.checked).map(x=>`&lt;script src=&quot;${x.dataset.url}&quot; integrity=&quot;${x.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`).join('\n');
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">CDN</button>
        </div>
    </div>
    <label class="install-row">
        <input type="checkbox" class="pick" checked
               data-url="https://cdn.jsdelivr.net/npm/@bigskysoftware/moxi-js@0.1.0/moxi.js"
               data-sri="sha256-mrpYW3yY45ec7RlIyDVCDx2/NnrZOQNB4v+OavwQo7Q="
               data-pkg="@bigskysoftware/moxi-js"
               data-ver="0.1.0">
        <code>&lt;script src="...<b>@0.1.0/moxi.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" on-click.halt="let p=this.closest('.install-row').querySelector('.pick');
                                                await navigator.clipboard.writeText(`&lt;script src=&quot;${p.dataset.url}&quot; integrity=&quot;${p.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </label>
    <label class="install-row">
        <input type="checkbox" class="pick" checked
               data-url="https://cdn.jsdelivr.net/npm/fixi-js@0.9.4/fixi.js"
               data-sri="sha256-rPuE58bCyMrZ37o4bByX4epgBA1bAeTylp7TxOXVh90="
               data-pkg="fixi-js"
               data-ver="0.9.4">
        <code>&lt;script src="...<b>@0.9.4/fixi.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" on-click.halt="let p=this.closest('.install-row').querySelector('.pick');
                                                await navigator.clipboard.writeText(`&lt;script src=&quot;${p.dataset.url}&quot; integrity=&quot;${p.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </label>
    <label class="install-row">
        <input type="checkbox" class="pick" checked
               data-url="https://cdn.jsdelivr.net/npm/@bigskysoftware/ssexi-js@0.0.1/ssexi.js"
               data-sri="sha256-/Apa7x6OzOp7AwjUoGNlM7n1Rma98JB515fUeJ/yjrM="
               data-pkg="@bigskysoftware/ssexi-js"
               data-ver="0.0.1">
        <code>&lt;script src="...<b>@0.0.1/ssexi.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" on-click.halt="let p=this.closest('.install-row').querySelector('.pick');
                                                await navigator.clipboard.writeText(`&lt;script src=&quot;${p.dataset.url}&quot; integrity=&quot;${p.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </label>
    <label class="install-row">
        <input type="checkbox" class="pick" checked
               data-url="https://cdn.jsdelivr.net/npm/@bigskysoftware/paxi-js@0.0.1/paxi.js"
               data-sri="sha256-EAglheIIvlwnF73UCBBTSIpd+Y9aDuzMJmya6UstvuU="
               data-pkg="@bigskysoftware/paxi-js"
               data-ver="0.0.1">
        <code>&lt;script src="...<b>@0.0.1/paxi.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" on-click.halt="let p=this.closest('.install-row').querySelector('.pick');
                                                await navigator.clipboard.writeText(`&lt;script src=&quot;${p.dataset.url}&quot; integrity=&quot;${p.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </label>
    <label class="install-row">
        <input type="checkbox" class="pick" checked
               data-url="https://cdn.jsdelivr.net/npm/@bigskysoftware/rexi-js@0.0.1/rexi.js"
               data-sri="sha256-cCEegdCXeB/kzcjjQ07v3ud2DUtKKhaCArdCI/mZAX4="
               data-pkg="@bigskysoftware/rexi-js"
               data-ver="0.0.1">
        <code>&lt;script src="...<b>@0.0.1/rexi.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" on-click.prevent.stop="let p=this.closest('.install-row').querySelector('.pick');
                                                        await navigator.clipboard.writeText(`&lt;script src=&quot;${p.dataset.url}&quot; integrity=&quot;${p.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                        let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </label>
</div>

NOTE: you will want to load `moxi` _before_ `fixi` so its `on-fx:init` and
`on-fx:process` handlers are registered before fixi dispatches those events on page load.

## <span class="ico">&#x1F9F0;</span> The Fixi Project All-in-One <small>(4.5kb brotli)</small> {#all-in-one}

All five libraries are also available pre-concatenated, minified, and brotli-compressed in
a single file:

<div class="installer">
    <div class="installer-header">
        <div class="installer-actions" style="margin-left:auto">
            <button data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.0/dist/the-fixi-project.min.js"
                    on-click="let s=`curl -o the-fixi-project@0.1.0.min.js ${this.dataset.url}`;
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">vendor</button>
            <button data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.0/dist/the-fixi-project.min.js"
                    data-sri="sha256-vgNYRU+0F96B+NgVmelclAT78PRqaAJDEHz5JfynmV0="
                    on-click="let s=`&lt;script src=&quot;${this.dataset.url}&quot; integrity=&quot;${this.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`;
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">CDN</button>
        </div>
    </div>
    <div class="install-row">
        <code>&lt;script src="...<b>@0.1.0/dist/the-fixi-project.min.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.0/dist/the-fixi-project.min.js"
                                 data-sri="sha256-vgNYRU+0F96B+NgVmelclAT78PRqaAJDEHz5JfynmV0="
                                 on-click.prevent.stop="await navigator.clipboard.writeText(`&lt;script src=&quot;${this.dataset.url}&quot; integrity=&quot;${this.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                        let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </div>
</div>

Or via npm:

```bash
npm install the-fixi-project
```

## Docs

The docs for the project can be found [here](docs.html).
