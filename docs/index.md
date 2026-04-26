---
layout: default
title: The Fixi Project
heading: '<span class="ico">&#x1F6B2;</span> The Fixi Project'
---

The fixi project is a collection of small web libraries, each one being a
[lightweight](https://www.youtube.com/watch?v=8BNP126zgPU) take on something else
[we've](https://four.htmx.org/about) built.

| library                              | size <small>(raw/br)</small> | inspiration                                                                     | provides                                                                          |
|--------------------------------------|------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| &#x1F6B2; [`fixi`](fixi.html)        | 3.4/1.2kb                    | [htmx](https://github.com/bigskysoftware/htmx)                                  | [supercharged](https://dl.acm.org/doi/fullHtml/10.1145/3648188.3675127) HTML      |
| &#x1F94A; [`moxi`](moxi.html)        | 4.6/1.8kb                    | [hyperscript](https://github.com/bigskysoftware/_hyperscript)                   | [inline](https://htmx.org/essays/locality-of-behaviour/) scripting & reactivity |
| &#x1F4E1; [`ssexi`](ssexi.html)      | 4.1/1.4kb                    | [hx-sse.js](https://github.com/bigskysoftware/htmx/blob/four/src/ext/hx-sse.js) | streaming HTML & events                                                           |
| &#x267B;&#xFE0F; [`paxi`](paxi.html) | 1.5/0.6kb                    | [idiomorph](https://github.com/bigskysoftware/idiomorph)                        | DOM patching/morphing                                                             |
| &#x1F415; [`rexi`](rexi.html)        | 4.3/1.4kb                    | [`fetch`](https://hyperscript.org/commands/fetch/)                              | ergonomic `fetch()` wrappers                                                      |
{:.libs}

## Installing {#installing}

Each library in the fixi project is a single standalone script.

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
               data-url="https://cdn.jsdelivr.net/npm/@bigskysoftware/moxi-js@0.1.1/moxi.js"
               data-sri="sha256-FYiaQ07vplZsK/jRKPT0yhLByqgC8cTXwe8SyuRy1lE="
               data-pkg="@bigskysoftware/moxi-js"
               data-ver="0.1.1">
        <code>&lt;script src="...<b>@0.1.1/moxi.js</b>"&gt;&lt;/script&gt;</code>
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

<div class="callout">
<strong>NOTE:</strong> you will want to load <code>moxi.js</code> <em>before</em> <code>fixi.js</code> so that <code>on-fx:init</code> and <code>on-fx:process</code> handlers are registered before <code>fixi.js</code> dispatches those events on page load.
</div>

## <span class="ico">&#x1F9F0;</span> The Fixi Project All-in-One <small>(4.5kb br)</small> {#all-in-one}

All five libraries are also available pre-concatenated, minified, and br-compressed in
a single file:

<div class="installer">
    <div class="installer-header">
        <div class="installer-actions" style="margin-left:auto">
            <button data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.1/dist/the-fixi-project.min.js"
                    on-click="let s=`curl -o the-fixi-project@0.1.1.min.js ${this.dataset.url}`;
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">vendor</button>
            <button data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.1/dist/the-fixi-project.min.js"
                    data-sri="sha256-aQhU79uUGCZTYXEtsijzqKVynikd1uZqOfGAovLVYOU="
                    on-click="let s=`&lt;script src=&quot;${this.dataset.url}&quot; integrity=&quot;${this.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`;
                              await navigator.clipboard.writeText(s);
                              let t=this.innerText;
                              this.innerText='copied!';
                              await wait(1200);
                              this.innerText=t">CDN</button>
        </div>
    </div>
    <div class="install-row">
        <code>&lt;script src="...<b>@0.1.1/dist/the-fixi-project.min.js</b>"&gt;&lt;/script&gt;</code>
        <a class="copy" href="#" data-url="https://cdn.jsdelivr.net/npm/the-fixi-project@0.1.1/dist/the-fixi-project.min.js"
                                 data-sri="sha256-aQhU79uUGCZTYXEtsijzqKVynikd1uZqOfGAovLVYOU="
                                 on-click.prevent.stop="await navigator.clipboard.writeText(`&lt;script src=&quot;${this.dataset.url}&quot; integrity=&quot;${this.dataset.sri}&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;/script&gt;`);
                                                        let t=this.innerText; this.innerText='copied!'; await wait(1200); this.innerText=t">copy</a>
    </div>
</div>

Or via npm:

```bash
npm install the-fixi-project
```

## License

All fixi projects are [BSD-0 Licensed](https://opensource.org/license/0bsd) and available on [Github](https://github.com/bigskysoftware/the-fixi-project).