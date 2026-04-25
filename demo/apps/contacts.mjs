let store = [
    { id: 1, name: 'Lena Park',     email: 'lena@example.com',        phone: '555-0101' },
    { id: 2, name: 'Kai Bennett',   email: 'kai@example.com',         phone: '555-0102' },
    { id: 3, name: 'Yuki Tanaka',   email: 'yuki.tanaka@example.com', phone: '555-0103' },
    { id: 4, name: 'Priya Sharma',  email: 'priya@example.com',       phone: '555-0104' },
    { id: 5, name: 'Diego Ramos',   email: 'diego.ramos@example.com', phone: '555-0105' },
    { id: 6, name: 'Mei Chen',      email: 'mei@example.com',         phone: '555-0106' },
    { id: 7, name: 'Olu Adesina',   email: 'olu@example.com',         phone: '555-0107' },
]
let nextId = 8
let trim = (s, n) => (s ?? '').trim().slice(0, n)

export let all = () => store

export let search = (q) => {
    if (!q) return store
    let n = q.toLowerCase()
    return store.filter((c) =>
        c.name.toLowerCase().includes(n) ||
        c.email.toLowerCase().includes(n) ||
        c.phone.includes(n))
}

export let find = (id) => store.find((x) => x.id === Number(id))

export let add = ({ name, email, phone }) => {
    let n = trim(name, 80)
    if (!n) return null
    let c = { id: nextId++, name: n, email: trim(email, 80), phone: trim(phone, 40) }
    store.push(c)
    return c
}

export let update = (id, { name, email, phone }) => {
    let c = find(id)
    if (!c) return null
    c.name  = trim(name, 80) || c.name
    if (email !== undefined) c.email = trim(email, 80)
    if (phone !== undefined) c.phone = trim(phone, 40)
    return c
}

export let remove = (id) => {
    let n = Number(id)
    let i = store.findIndex((x) => x.id === n)
    if (i < 0) return false
    store.splice(i, 1)
    return true
}
