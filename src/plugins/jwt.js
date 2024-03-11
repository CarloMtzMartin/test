const fp = require('fastify-plugin')

const jwt_plugin = async (fastify, options) => {
  fastify.register(require('@fastify/auth'))

  fastify.register(require('@fastify/jwt'), {
    secret: 'supertest',
    formatUser: (user) => ({
      id: user.id,
      email: user.email
    }),
    sign: {
      expiresIn: '1d'
    }
  })

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
      request.userId = request.user.id
    } catch (err) {
      reply.send(err)
    }
  })
}

module.exports = fp(jwt_plugin)
