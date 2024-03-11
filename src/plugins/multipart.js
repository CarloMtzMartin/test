const fp = require('fastify-plugin')

const multipartPlugin = async (fastify, opts) => {
  fastify.register(require('@fastify/multipart'))
}

module.exports = fp(multipartPlugin)
