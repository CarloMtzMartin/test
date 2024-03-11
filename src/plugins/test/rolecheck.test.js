/*const { test } = require('tap')
const fastify = require('fastify')

test('init', async ({ teardown, equal, same, error }) => {
  const server = fastify()

  server.get('/', async (_, reply) => {
    return { hello: 'world' }
  })

  const response = await server.inject({ method: 'GET', url: '/' })
  same(await response.json(), { hello: 'world' })
})
*/
