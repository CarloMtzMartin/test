const fp = require('fastify-plugin')

const env_plugin = async (fastify) => {
  fastify
    .register(require('@fastify/env'), {
      dotenv: true,
      schema: {
        type: 'object',
        required: ['PORT', 'EMAILSENDER'],
        properties: {
          PORT: {
            type: 'string',
            default: 4000
          },
          EMAILSENDER: {
            type: 'string'
          },
          EMAILACTIVITY: {
            type: 'string'
          },
          DOMAIN: {
            type: 'string'
          },
          SENDERPASSWORD: {
            type: 'string'
          },
          SMOOBU_APIKEY: {
            type: 'string'
          }
        }
      }
    })
    .ready((err) => {
      if (err) console.error(err)

      console.log('ENV: ', fastify.config)
    })
}

module.exports = fp(env_plugin)
