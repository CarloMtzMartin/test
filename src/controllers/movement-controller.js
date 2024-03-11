const { fsUtils } = require('../helpers')
const { makeMovement } = require('./movement/helper')
const {
  movementRepository,
  ownershipRepository,
  walletRepository
} = require('../repositories')
const { MOVEMENT_TYPE } = require('../repositories/identifiers')

const movementController = (fastify) => {
  const repo = movementRepository(fastify)
  const repoOwnership = ownershipRepository(fastify)
  const repoWallet = walletRepository(fastify)

  return {
    getByOwnership: async (request, reply) => {
      const result = await repo.getByOwnershipId(request.params.id)

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    getMonthByOwnershipId: async (request, reply) => {
      const { ownershipid, month, year } = request.params

      const result = await repo.getMonthByOwnerships({
        month,
        year,
        ownerships: [ownershipid]
      })

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    getMonthByAccountId: async (request, reply) => {
      const { accountid, month, year } = request.params

      const ownerships = (await repoOwnership.getByAccountId(accountid)).map(
        (el) => el.id
      )

      const result = await repo.getMonthByOwnerships({ month, year, ownerships })

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create: async (request, reply) => {
      const result = await makeMovement({
        type: MOVEMENT_TYPE.OUT,
        repoMovement: repo,
        movement: request.body,
        repoWallet,
        repoOwnership
      })

      if (result.error) {
        return reply.code(400).send({
          message: result?.message
        })
      }

      reply.send({
        data: result?.id,
        message: 'Categoría creada'
      })
    },

    update_image: async (request, reply) => {
      const data = await request.file()
      const ruleField = ['id', 'file'].join('')
      const inField = Object.keys(data.fields).join('')
      if (inField !== ruleField) {
        return reply.code(406).send({
          message: 'Multipart con campos inválidos'
        })
      }

      const path = await fsUtils.readFile(data)
      const { value: id } = data.fields.id

      const result = await repo.update({
        id,
        photo: path
      })

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.code(200).send({
        message: 'Imagen actualizada exitosamente'
      })
    },

    remove: async (request, reply) => {
      await fastify.emitter.deleteMovementEmit(request.body)
      const result = await repo.remove({ id: request.body.id })

      if (!result) {
        return reply.code(400).send({
          message: 'No se pudo realizar la operación'
        })
      }

      reply.code(200).send({
        message: 'Operación exitosa'
      })
    }
  }
}

module.exports = movementController
