const {
  stayRepository,
  accountRepository,
  ownershipRepository
} = require('../repositories')

const stayController = (fastify) => {
  const repo = stayRepository(fastify)
  const repoAccount = accountRepository(fastify)
  const repoOwnership = ownershipRepository(fastify)

  return {
    getAll: async (_, reply) => {
      const result = await repo.getAll()
      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    getByFieldId: async (request, reply) => {
      const { field, id } = request.params

      if (!['account', 'ownership'].includes(field)) {
        return reply.code(400).send({
          message: 'params field erroneo'
        })
      }

      const action = {
        account: repo.getByAccountId,
        ownership: repo.getByOwnershipId
      }[field]

      const results = await action(id)

      if (!results) {
        return reply.code(400).send({
          message: 'ha ocurrido un error'
        })
      }

      reply.code(200).send({
        data: results,
        message: 'Lista entregada'
      })
    },

    create: async (request, reply) => {
      const validAccountId = await repoAccount.getById(request.body.account_id)

      if (!validAccountId) {
        return reply.code(400).send({
          message: 'No se encontró el usuario'
        })
      }

      const validOwnershipId = await repoOwnership.getById(
        request.body.ownership_id
      )

      if (!validOwnershipId) {
        return reply.code(400).send({
          message: 'No se encontró propiedad'
        })
      }

      const result = await repo.create(request.body)

      if (!result) {
        return reply.code(400).send({
          message: 'Ocurrió un error'
        })
      }

      reply.send({
        message: 'Estadía creado éxitosamente'
      })
    },

    update: async (request, reply) => {
      const result = await repo.update(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación'
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
        message: 'Estadía eliminada exitosamente'
      })
    }
  }
}

module.exports = stayController
