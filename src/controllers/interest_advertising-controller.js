const {
  interestAdvertisingRepository,
  advertisingRepository,
  accountRepository
} = require('../repositories')

const interestAdvertisingController = (fastify) => {
  const repo = interestAdvertisingRepository(fastify)
  const repoAdvertising = advertisingRepository(fastify)
  const repoAccount = accountRepository(fastify)

  return {
    get_all: async (_, reply) => {
      const result = await repo.get_all()
      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create: async (request, reply) => {
      const validAccountId = await repoAccount.getById(
        request.body.account_id
      )

      if (!validAccountId) {
        return reply.code(400).send({
          message: 'No se encontró el interesado en publicidad'
        })
      }

      const validAdvertisingId = await repoAdvertising.getById(
        request.body.advertising_id
      )

      if (!validAdvertisingId) {
        return reply.code(400).send({
          message: 'No se encontró la publicidad'
        })
      }

      const result = await repo.create(request.body)

      if (!result) {
        return reply.code(400).send({
          message: 'Ocurrió un error'
        })
      }

      reply.send({
        message: 'Interés creado éxitosamente'
      })
    },

    update: async (request, reply) => {
      const result = await repo.update(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.send({
        message: 'Actualizado exitoso'
      })
    },

    remove: async (request, reply) => {
      const result = await repo.remove(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación'
        })
      }

      reply.send({
        message: 'Publicidad eliminada existosamente'
      })
    }
  }
}

module.exports = interestAdvertisingController
