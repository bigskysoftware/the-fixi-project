// Tiny method+path router. Patterns are strings like '/contacts/:id/edit';
// each :name segment matches one path component and ends up in `params` on
// the handler call: (req, res, params) => ...
let compile = (pattern) => {
    let names = []
    let src = pattern.replace(/\/:([a-zA-Z_]+)/g, (_, n) => { names.push(n); return '/([^/]+)' })
    let re = new RegExp('^' + src + '$')
    return (path) => {
        let m = path.match(re)
        if (!m) return null
        let p = {}
        for (let i = 0; i < names.length; i++) p[names[i]] = decodeURIComponent(m[i + 1])
        return p
    }
}

export let createRouter = () => {
    let routes = []
    let add = (method, pattern, handler) => routes.push({ method, match: compile(pattern), handler })
    let api = {
        get:    (p, h) => (add('GET',    p, h), api),
        post:   (p, h) => (add('POST',   p, h), api),
        put:    (p, h) => (add('PUT',    p, h), api),
        delete: (p, h) => (add('DELETE', p, h), api),
        patch:  (p, h) => (add('PATCH',  p, h), api),
        async handle(req, res) {
            let path = req.url.split('?')[0]
            for (let r of routes) {
                if (r.method !== req.method) continue
                let params = r.match(path)
                if (params) { await r.handler(req, res, params); return true }
            }
            return false
        },
    }
    return api
}
