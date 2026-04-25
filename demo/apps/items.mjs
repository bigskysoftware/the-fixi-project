let store = [
    { id: 1, title: 'Read the fixi source',     done: true  },
    { id: 2, title: 'Try the bulk ops',         done: false },
    { id: 3, title: 'Wire paxi into a project', done: false },
    { id: 4, title: 'Ship it',                  done: false },
]
let nextId = 5

export let all = () => store

export let add = (title) => {
    let t = (title || '').trim().slice(0, 120)
    if (t) store.push({ id: nextId++, title: t, done: false })
}

export let toggle = (id) => {
    let it = store.find((x) => x.id === Number(id))
    if (it) it.done = !it.done
}

export let remove = (id) => {
    store = store.filter((x) => x.id !== Number(id))
}

// if every item is done, clear all; otherwise mark all done
export let toggleAll = () => {
    let allDone = store.length > 0 && store.every((it) => it.done)
    for (let it of store) it.done = !allDone
}

export let clearCompleted = () => {
    store = store.filter((it) => !it.done)
}
