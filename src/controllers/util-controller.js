const { sendNotification } = require('../services/notification')

const utilController = (fastify) => {
  return {
    bridgeSmoobuRequest: async (request, reply) => {
      const result = await fastify.smoobu.genericRequest(request.body.query)

      reply.send({
        data: result
      })
    },

    sendNotification: async (request, reply) => {
      const { name, email, phone, typeNotify } = request.body

      const payload = { name, email, phone }

      const result = await sendNotification({
        from: fastify.config.EMAILSENDER,
        senderPassword: fastify.config.SENDERPASSWORD,
        to: fastify.config.EMAILACTIVITY,
        payload,
        typeNotify
      })

      reply.send({
        data: result
      })
    }
  }
}

module.exports = utilController
