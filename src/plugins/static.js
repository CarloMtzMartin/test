const fp = require('fastify-plugin')
const path = require('node:path')
const fastifyStatic = require('@fastify/static')

const staticPlugin = async (fastify, opts) => {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'images'),
    prefix: '/images/'
  })
}

module.exports = fp(staticPlugin)
