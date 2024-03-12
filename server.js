const fastify = require('fastify')({
  logger: true
})

const plugins = require('./src/plugins')
const routes = require('./src/v1/routes')

fastify.register(require('@fastify/cors'), { origin: '*' })

Object.entries(plugins).forEach(([_, plugin]) => {
  fastify.register(plugin)
})
Object.entries(routes).forEach(([_, route]) => {
  fastify.register(route, { prefix: 'v1/' })
})

fastify.get('/', async (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.ready((err) => {
  if (err) {
    console.error('ERROR WHEN INIT SERVER', err)
    return
  }

  fastify.listen({host: '0.0.0.0', port: fastify.config.PORT }, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
})
