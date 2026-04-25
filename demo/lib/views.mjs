import { Eta } from 'eta'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const eta = new Eta({ views: join(__dirname, '..', 'views'), cache: false, useWith: true })
export const render = (name, data = {}) => eta.render(name, data)
