const { pickupRepository } = require('../repositories')

const pickupController = (fastify) => {
  const repo = pickupRepository(fastify)

  return {
    getByAccountId: async (request, reply) => {
      const { id } = request.params
      const results = await repo.getByAccountId(id)

      reply.send({
        data: results,
        message: 'Lista entregada'
      })
    },

    get_all_pickup: async (_, reply) => {
      const result = await repo.get_all_pickup()
      if (!result) {
        return reply.code(500).send({
          message: 'Error interno'
        })
      }

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create_pickup: async (request, reply) => {
      const result = await repo.create_pickup(request.body)
      if (!result) {
        return reply.code(400).send({
          message: 'No se puede solicitar este servicio'
        })
      }

      reply.send({
        message: 'Servicio solicitado con éxito'
      })
    },

    update_pickup: async (request, reply) => {
      const result = await repo.update_pickup(request.body)
      if (!result) {
        return reply.code(400).send({
          message: 'No se pudo cambiar el estado'
        })
      }

      reply.send({
        message: 'Servicio actualizado exitoso'
      })
    }
  }
}

module.exports = pickupController
