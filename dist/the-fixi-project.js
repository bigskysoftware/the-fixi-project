// moxi/moxi.js
(()=>{
	let doc = document
	if(doc.__moxi_mo) return
	let liveFns = new Set(), pending = false,
	recompute = ()=>{
		if (pending) return
		pending = true
		queueMicrotask(()=>{liveFns.forEach(f=>f()); setTimeout(()=>pending = false)})
	}
	doc.__moxi_mo = new MutationObserver(recs=>{
		recs.forEach(r=>r.type == "childList" && r.addedNodes.forEach(n=>process(n)))
		recompute()
	})
	let AF = async function(){}.constructor, HARGS = ["q", "wait", "trigger", "debounce"],
	fire = (elt, type, detail, bub)=>elt.dispatchEvent(new CustomEvent(type, {detail, cancelable:1, bubbles:bub??1, composed:1})),
	el = (e,n,h,o)=>e.addEventListener(n,h,o),
	DB = Symbol(),
	mkDb = ()=>{let last = 0, j; return ms=>new Promise((r,rj)=>{j?.(DB); j = rj; let id = ++last; setTimeout(()=>id == last && (j = null, r()), ms)})},
	mkWait = ctx=>x=>new Promise(r=>typeof x == "number" ? setTimeout(r,x) : el(ctx,x,r,{once:1})),
	ignore = elt=>elt.closest("[mx-ignore]"),
	one = x=>x?[x]:[],
	POS = {before:"beforebegin",after:"afterend",start:"afterbegin",end:"beforeend"},
	proxy = elts=>new Proxy({}, {
		get:(_,p)=>{
			if (p == "count") return elts.length
			if (p == "arr") return ()=>elts.slice()
			if (p == Symbol.iterator) return ()=>elts.values()
			if (p == "trigger") return (t,d,b)=>elts.forEach(e=>fire(e,t,d,b))
			if (p == "insert") return (pos,s)=>elts.forEach(e=>e.insertAdjacentHTML(POS[pos],s))
			if (p == "take") return (cls,from)=>{
				for (let e of typeof from == "string" ? doc.querySelectorAll(from) : from) e.classList.remove(cls)
				for (let e of elts) e.classList.add(cls)
			}
			let v = elts[0]?.[p]
			if (v?.call) return (...a)=>elts.map(e=>e[p](...a))[0]
			if (v && typeof v == "object") return proxy(elts.map(e=>e[p]))
			return v
		},
		set:(_,p,v)=>(elts.forEach(e=>e[p]=v),recompute(),true)
	}),
	mkq = ctx=>sel=>{
		if (typeof sel != "string") return proxy(sel.nodeType ? [sel] : [...sel])
		let im = sel.match(/^(.+)\s+in\s+(.+)$/), root = doc
		if (im){ sel = im[1]; root = im[2] == "this" ? ctx : doc.querySelector(im[2]) }
		if (!root) return proxy([])
		let m = sel.match(/^(next|prev|closest|first|last)\s+(.+)$/), elts
		if (m){
			let [,d,s] = m, cdp = e=>ctx.compareDocumentPosition(e)
			if (d == "closest") elts = one(ctx.closest(s))
			else {
				let all = [...root.querySelectorAll(s)]
				if (d == "first") elts = all.slice(0,1)
				else if (d == "last") elts = all.slice(-1)
				else if (d == "next") elts = one(all.find(e=>cdp(e) & 4))
				else elts = one(all.reverse().find(e=>cdp(e) & 2))
			}
		} else elts = [...root.querySelectorAll(sel)]
		return proxy(elts)
	},
	init = elt=>{
		if (elt.__moxi || ignore(elt)) return
		if (!fire(elt, "mx:init", {})) return
		elt.__moxi = {}
		let q = mkq(elt), wait = mkWait(elt), trigger = fire.bind(0,elt), liveRuns = []
		for (let a of elt.attributes){
			if (a.name == "live"){
				let fn = new AF(...HARGS, a.value),
				debounce = mkDb(),
				run = ()=>elt.isConnected ? fn.call(elt, q, wait, trigger, debounce) : liveFns.delete(run)
				liveFns.add(run)
				liveRuns.push(run)
			} else if (a.name.startsWith("on-")){
				let [name, ...mods] = a.name.slice(3).split("."),
				has = m=>mods.includes(m), h = has("halt"), debounce = mkDb()
				if (has("cc")) name = name.replace(/-([a-z])/g, (_,c)=>c.toUpperCase())
				let target = has("outside") ? doc : elt,
				opts = {capture: has("capture"), passive: has("passive")},
				fn = new AF("event", ...HARGS, `with(event?.detail||{}){${a.value}}`),
				handler = elt.__moxi[name] = evt=>{
					if (evt && (has("self") && evt.target != elt || has("outside") && elt.contains(evt.target))) return
					if (h || has("prevent")) evt?.preventDefault()
					if (h || has("stop")) evt?.stopPropagation()
					if (has("once")) target.removeEventListener(name, handler, opts)
					return fn.call(elt, evt, q, wait, trigger, debounce).catch(e=>{if(e!=DB) throw e})
				}
				if (name == "init") handler()
				else el(target, name, handler, opts)
			}
		}
		liveRuns.forEach(r=>r())
		fire(elt, "mx:inited", {}, false)
	},
	process = n=>{
		if (n.nodeType != 1 || ignore(n)) return
		let r = doc.evaluate("descendant-or-self::*[@live or @*[starts-with(name(),'on-')]]", n, null, 7, null)
		for (let i = 0; i < r.snapshotLength; i++) init(r.snapshotItem(i))
	},
	gt = globalThis, de = doc.documentElement
	gt.q = mkq(de)
	gt.wait = mkWait(de)
	gt.transition = fn=>doc.startViewTransition ? doc.startViewTransition(fn) : fn()
	el(doc, "mx:process", evt=>process(evt.target))
	el(doc, "refresh", recompute)
	el(doc, "DOMContentLoaded", ()=>{
		doc.__moxi_mo.observe(de, {childList:1, subtree:1, attributes:1, characterData:1})
		el(doc, "input", recompute, true)
		el(doc, "change", recompute, true)
		process(doc.body)
	})
})()
;
// fixi/fixi.js
(()=>{
	if(document.__fixi_mo) return;
	document.__fixi_mo = new MutationObserver((recs)=>recs.forEach((r)=>r.type === "childList" && r.addedNodes.forEach((n)=>process(n))))
	let send = (elt, type, detail, bub)=>elt.dispatchEvent(new CustomEvent("fx:" + type, {detail, cancelable:true, bubbles:bub !== false, composed:true}))
	let attr = (elt, name, defaultVal)=>elt.getAttribute(name) || defaultVal
	let dflt = (n, d)=>(window.fixiCfg ?? {})[n] ?? d
	let ignore = (elt)=>elt.closest("[fx-ignore]") != null
	let init = (elt)=>{
		let options = {}
		if (elt.__fixi || ignore(elt) || !send(elt, "init", {options})) return
		elt.__fixi = async(evt)=>{
			let reqs = elt.__fixi.requests ||= new Set()
			let form = elt.form || elt.closest("form")
			let body = new FormData(form ?? undefined, evt.submitter)
			if (elt.name && !evt.submitter && (!form || (elt.form === form && elt.type === 'submit'))) body.append(elt.name, elt.value)
			let ac = new AbortController()
			let cfg = {
				trigger:evt,
				action:attr(elt, "fx-action"),
				method:attr(elt, "fx-method", "GET").toUpperCase(),
				target:document.querySelector(attr(elt, "fx-target")) ?? elt,
				swap:attr(elt, "fx-swap", dflt("swap", "outerHTML")),
				body,
				drop:reqs.size,
				headers:{"FX-Request":"true", ...window.fixiCfg?.headers},
				abort:ac.abort.bind(ac),
				signal:ac.signal,
				preventTrigger:true,
				transition:dflt("transition", document.startViewTransition?.bind(document)),
				fetch:fetch.bind(window)
			}
			let go = send(elt, "config", {cfg, requests:reqs})
			if (cfg.preventTrigger) evt.preventDefault()
			if (!go || cfg.drop) return
			if (/GET|DELETE/.test(cfg.method)){
				let params = new URLSearchParams(cfg.body)
				if (params.size)
					cfg.action += (/\?/.test(cfg.action) ? "&" : "?") + params
				cfg.body = null
			}
			reqs.add(cfg)
			try {
				if (cfg.confirm){
					let result = await cfg.confirm()
					if (!result) return
				}
				if (!send(elt, "before", {cfg, requests:reqs})) return
				cfg.response = await cfg.fetch(cfg.action, cfg)
				cfg.text = await cfg.response.text()
				if (!send(elt, "after", {cfg})) return
			} catch(error) {
				send(elt, "error", {cfg, error})
				return
			} finally {
				reqs.delete(cfg)
				send(elt, "finally", {cfg})
			}
			let doSwap = ()=>{
				if (cfg.swap instanceof Function)
					return cfg.swap(cfg)
				else if (/(before|after)(begin|end)/.test(cfg.swap))
					cfg.target.insertAdjacentHTML(cfg.swap, cfg.text)
				else if(cfg.swap in cfg.target)
					cfg.target[cfg.swap] = cfg.text
				else if(cfg.swap !== 'none') throw cfg.swap
			}
			if (cfg.transition)
				await cfg.transition(doSwap).finished
			else
				await doSwap()
			send(elt, "swapped", {cfg})
			if (!document.contains(elt)) send(document, "swapped", {cfg})
		}
		elt.__fixi.evt = attr(elt, "fx-trigger", elt.matches("form") ? "submit" : elt.matches("input:not([type=button]),select,textarea") ? "change" : "click")
		elt.addEventListener(elt.__fixi.evt, elt.__fixi, options)
		send(elt, "inited", {}, false)
	}
	let process = (n)=>{
		if (n.matches){
			if (ignore(n)) return
			if (n.matches("[fx-action]")) init(n)
		}
		if(n.querySelectorAll) n.querySelectorAll("[fx-action]").forEach(init)
	}
	document.addEventListener("fx:process", (evt)=>process(evt.target))
	document.addEventListener("DOMContentLoaded", ()=>{
		document.__fixi_mo.observe(document.documentElement, {childList:true, subtree:true})
		process(document.body)
	})
})()
;
// ssexi/ssexi.js
(()=>{
	let send = (elt, type, detail)=>elt.dispatchEvent(new CustomEvent("fx:sse:" + type, {detail, cancelable:true, bubbles:true, composed:true}))
	async function* parseSSE(reader) {
		let buf = '', dec = new TextDecoder(), msg = {data:'', event:'', id:'', retry:null}
		while (true) {
			let {done, value} = await reader.read()
			if (done) break
			buf += dec.decode(value, {stream:true})
			let lines = buf.split(/\r\n|\r|\n/)
			buf = lines.pop()
			for (let line of lines) {
				if (!line) {
					if (msg.data || msg.event || msg.id || msg.retry) yield msg
					msg = {data:'', event:'', id:'', retry:null}
				} else if (line[0] !== ':') {
					let i = line.indexOf(':'), field = i > 0 ? line.slice(0, i) : line, val = i > 0 ? line.slice(i+1).replace(/^ /, '') : ''
					if (field === 'data') msg.data += (msg.data ? '\n' : '') + val
					else if (field === 'retry') msg.retry = parseInt(val) || null
					else if (field in msg) msg[field] = val
				}
			}
		}
		if (msg.data || msg.event || msg.id || msg.retry) yield msg
	}
	document.addEventListener("fx:config", (evt)=>{
		let cfg = evt.detail.cfg, realFetch = cfg.fetch
		cfg.headers.Accept ??= "text/html, text/event-stream"
		cfg.fetch = async(url, options)=>{
			let response = await realFetch(url, options)
			if (!response.headers.get('Content-Type')?.includes('text/event-stream')) return response
			let style = cfg.sseSwap || cfg.swap, sse = cfg.sse = {lastEventId:'', retry:null, reader:response.body.getReader(), closed:false}
			sse.close = ()=>{ sse.closed = true; sse.reader?.cancel() }
			if (!send(cfg.target, 'open', {cfg, response})) { cfg.swap = 'none'; return new Response('') }
			let target = cfg.target, anchor = null
			if (style === 'outerHTML') { anchor = document.createElement('i'); anchor.style.display = 'none'; target.after(anchor) }
			let et = anchor || target
			let onVis = null
			if (cfg.sseDisconnectOnHidden) onVis = ()=>document.hidden && sse.close()
			else if (cfg.ssePauseOnHidden) onVis = ()=>document.hidden && sse.reader?.cancel()
			if (onVis) document.addEventListener('visibilitychange', onVis)
			try {
				while (!sse.closed) {
					try {
						for await (let msg of parseSSE(sse.reader)) {
							if (msg.id) sse.lastEventId = msg.id
							if (msg.retry) sse.retry = msg.retry
							if (!send(et, 'message', {cfg, message:msg})) { sse.close(); break }
							let t = target, s = style, tx = false
							if (msg.event && msg.event[0] === '{') {
								let e = JSON.parse(msg.event)
								if (e.target) t = document.querySelector(e.target)
								if (e.swap) s = e.swap
								tx = e.transition
							} else if (msg.event) { send(et, msg.event, {cfg, message:msg}); t = null }
							if (t && msg.data) {
								let swap = ()=>{
									if (s instanceof Function) s(t, msg.data)
									else if (/(before|after)(begin|end)/i.test(s)) t.insertAdjacentHTML(s, msg.data)
									else if (s in t) t[s] = msg.data
								}
								if (tx && cfg.transition) await cfg.transition(swap).finished
								else swap()
								send(t.isConnected ? t : et, 'swapped', {cfg, message:msg})
								if (t === target && anchor) { target = anchor; style = 'beforebegin' }
							}
						}
						send(et, 'close', {cfg})
					} catch(error) { send(et, 'error', {cfg, error}) }
					if (sse.closed) break
					if (!cfg.sseReconnect && !(cfg.ssePauseOnHidden && document.hidden)) break
					if (cfg.ssePauseOnHidden && document.hidden) {
						await new Promise(r=>{let h=()=>{if(!document.hidden||sse.closed){document.removeEventListener('visibilitychange',h);r()}};document.addEventListener('visibilitychange',h)})
					} else await new Promise(r=>setTimeout(r, sse.retry || 3000))
					if (sse.closed) break
					try {
						let hdrs = new Headers(options.headers)
						if (sse.lastEventId) hdrs.set('Last-Event-ID', sse.lastEventId)
						sse.reader = (await realFetch(url, {...options, headers: hdrs})).body.getReader()
					} catch(error) { send(et, 'error', {cfg, error}); continue }
				}
			} finally {
				anchor?.remove()
				if (onVis) document.removeEventListener('visibilitychange', onVis)
			}
			cfg.swap = 'none'
			return new Response('')
		}
	})
})()
;
// paxi/paxi.js
(()=>{
	let mx = (o, n, ids)=>{
		if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName){
			n.querySelectorAll?.("[id]").forEach((ne)=>{
				if (!n.contains(ne)) return
				let oe = ids[ne.id]
				if (oe){ delete ids[ne.id]; mx(oe, ne, ids); ne.replaceWith(oe) }
			})
			return o.replaceWith(n)
		}
		if (o.nodeType === 3 || o.nodeType === 8){
			if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue
			return
		}
		for (let a of [...o.attributes]) if (!n.hasAttribute(a.name)) o.removeAttribute(a.name)
		for (let a of n.attributes) if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value)
		let oIds = {}
		for (let c of o.children) if (c.id) oIds[c.id] = c
		let oc = o.firstChild, nc = n.firstChild, on, nn, m
		while (oc && nc){
			on = oc.nextSibling; nn = nc.nextSibling
			if (nc.id){
				m = oIds[nc.id]
				if (m && m !== oc){ o.insertBefore(m, oc); mx(m, nc, ids); nc = nn; continue }
				if (!m){ o.insertBefore(nc, oc); nc = nn; continue }
			}
			mx(oc, nc, ids)
			oc = on; nc = nn
		}
		while (oc){ on = oc.nextSibling; oc.remove(); oc = on }
		while (nc){ nn = nc.nextSibling; o.appendChild(nc); nc = nn }
	}
	window.morph = (target, html)=>{
		let t = document.createElement("template")
		t.innerHTML = html
		let ids = {}
		target.querySelectorAll("[id]").forEach((e)=>ids[e.id] = e)
		mx(target, t.content.firstElementChild, ids)
	}
	document.addEventListener("fx:config", (e)=>{
		if (e.detail.cfg.swap === "morph") e.detail.cfg.swap = (cfg)=>morph(cfg.target, cfg.text)
	})
})();
// rexi/rexi.js
(()=>{
	let QS_DEFAULT = {GET: 1, HEAD: 1, DELETE: 1}
	let doc = document

	let isEltIter = (x)=>{
		if (!x || typeof x !== "object" || x instanceof FormData || x instanceof Element) return false
		if (!(Symbol.iterator in x)) return false
		for (let i of x) return i instanceof Element
		return false
	}

	let isRaw = (b)=>typeof b === "string"
		|| b instanceof Blob
		|| b instanceof URLSearchParams
		|| b instanceof ArrayBuffer

	let appendFields = (fd, el)=>{
		if (!el) return
		if (el instanceof HTMLFormElement) { for (let [k, v] of new FormData(el)) fd.append(k, v); return }
		if (!el.name) return
		if (el instanceof HTMLInputElement) {
			if (el.type === "file") { for (let f of el.files) fd.append(el.name, f) }
			else if (el.type === "checkbox" || el.type === "radio") { if (el.checked) fd.append(el.name, el.value) }
			else fd.append(el.name, el.value)
		} else if (el instanceof HTMLSelectElement && el.multiple) {
			for (let o of el.selectedOptions) fd.append(el.name, o.value)
		} else if ("value" in el) fd.append(el.name, el.value)
	}

	let toFD = (body)=>{
		if (body instanceof FormData) return body
		let fd = new FormData()
		if (body == null) return fd
		if (body instanceof URLSearchParams) { for (let [k, v] of body) fd.append(k, v); return fd }
		if (typeof body === "string") { for (let [k, v] of new URLSearchParams(body)) fd.append(k, v); return fd }
		if (body instanceof Element) appendFields(fd, body)
		else if (isEltIter(body)) { for (let el of body) appendFields(fd, el) }
		else for (let [k, v] of Object.entries(body)) {
			if (Array.isArray(v)) { for (let x of v) fd.append(k, x) }
			else if (v != null) fd.append(k, v)
		}
		return fd
	}

	let resolve = (inc)=>{
		if (inc == null) return []
		if (typeof inc === "string") return [...doc.querySelectorAll(inc)]
		if (inc instanceof Element) return [inc]
		if (Symbol.iterator in Object(inc)) {
			let out = []
			for (let i of inc) for (let e of resolve(i)) out.push(e)
			return out
		}
		return []
	}

	let isJson = (b)=>b != null && typeof b === "object" && !(b instanceof FormData) && !(b instanceof Element) && !isEltIter(b) && !isRaw(b)

	let toQS = (fd)=>{
		let p = new URLSearchParams()
		for (let [k, v] of fd) if (!(v instanceof Blob)) p.append(k, v)
		return p.toString()
	}

	let wrap = (p, ctl)=>{
		p.json  = ()=>p.then((r)=>r.json())
		p.text  = ()=>p.then((r)=>r.text())
		p.blob  = ()=>p.then((r)=>r.blob())
		p.html  = ()=>p.then((r)=>r.text()).then((t)=>{let tpl = doc.createElement("template"); tpl.innerHTML = t; return tpl.content})
		p.raw   = ()=>p
		p.abort = ()=>ctl.abort()
		return p
	}

	let req = async (method, url, body, ctl, {timeout, signal, include, send, headers = {}, ...rest} = {})=>{
		if (signal) signal.addEventListener("abort", ()=>ctl.abort(), {once: true})
		if (timeout) setTimeout(()=>ctl.abort(), timeout)
		let asQuery = (send === "query") || (send !== "body" && QS_DEFAULT[method])
		let init = {method, headers: {...headers}, ...rest, signal: ctl.signal}
		if (asQuery) {
			let fd = toFD(body)
			for (let el of resolve(include)) appendFields(fd, el)
			let qs = toQS(fd)
			if (qs) url += (url.includes("?") ? "&" : "?") + qs
		} else if (isRaw(body)) {
			init.body = body
		} else if (include == null && isJson(body)) {
			init.body = JSON.stringify(body)
			init.headers["Content-Type"] ??= "application/json"
		} else if (body != null || include != null) {
			let fd = toFD(body)
			for (let el of resolve(include)) appendFields(fd, el)
			init.body = fd
		}
		let cfg = {url, init}
		if (!doc.dispatchEvent(new CustomEvent("rexi:before", {detail: {cfg}, cancelable: true}))) {
			throw new DOMException("Request cancelled by rexi:before listener", "AbortError")
		}
		let res = await fetch(cfg.url, cfg.init)
		doc.dispatchEvent(new CustomEvent("rexi:after", {detail: {cfg, response: res}}))
		if (!res.ok) throw Object.assign(new Error(`${method} ${cfg.url} -> ${res.status}`), {status: res.status, response: res})
		return res
	}

	let make = (method)=>(url, body, opts)=>{
		let ctl = new AbortController()
		return wrap(req(method, url, body, ctl, opts), ctl)
	}

	let api = {}
	for (let n of ["get", "head", "post", "put", "patch"]) api[n] = make(n.toUpperCase())
	api.del = make("DELETE")
	window.rexi = api
	for (let k of ["get", "head", "post", "put", "patch", "del"]) window[k] = api[k]
})()
;
