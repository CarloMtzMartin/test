const fp = require('fastify-plugin')

const cachePlugin = (fastify, _, next) => {
  const cache = {}

  const optimization = (key) =>
    new Promise((resolve) => {
      const [from, to, page] = key.split('-')
      const keys = Object.keys(cache)
      let keyToDelete

      for (let i = 0; i < keys.length; i++) {
        const old = keys[0]
        const [f, t, p] = old.split('-')

        if (page !== p) {
          continue
        }

        if (to !== t) {
          keyToDelete = f === from ? old : undefined
        }

        if (keyToDelete) {
          break
        }
      }

      delete cache[keyToDelete]
      resolve()
    })

  const append = (key, value) =>
    new Promise((resolve) => {
      optimization(key).then((_) => {
        cache[key] = JSON.stringify(value)
        resolve()
      })
    })

  const get = (key) =>
    new Promise((resolve) => {
      const element = cache[key]
      if (element) {
        return resolve(JSON.parse(element))
      }
      resolve(null)
    })

  fastify.cache = {
    append,
    get
  }

  next()
}

module.exports = fp(cachePlugin)
