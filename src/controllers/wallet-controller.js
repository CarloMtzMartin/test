const { fullDatetimeNow } = require('../helpers/datelib')
// const { makeMovement } = require('./movement/helper')
const {
  walletRepository,
  ownershipRepository
} = require('../repositories')

const walletController = (fastify) => {
  const repoOwnership = ownershipRepository(fastify)
  const repo = walletRepository(fastify)

  return {
    setUSD: async (request, reply) => {
      const ownership_id = request.body.ownership_id

      let wallet = await repo.getByOwnershipId(ownership_id)
      let walletId = wallet?.id

      if (!wallet) {
        // should be create wallet
        const ownership = await repoOwnership.getById(ownership_id)
        if (!ownership) {
          return { error: true, message: 'No se encontro la billetera' }
        }

        walletId = await repo.create({
          ownership_id,
          account_id: ownership.owner_id,
          amount: 0,
          usd_amount: 0
        })

        if (!walletId) {
          return { error: true, message: 'No se pudo crear la billetera' }
        }

        wallet = await repo.getByOwnershipId(ownership_id)
      }

      const result = await repo.update({
        id: walletId,
        ...request.body,
        update_at: fullDatetimeNow()
      })

      if (result.error) {
        return reply.code(400).send({
          message: result?.message
        })
      }

      console.log(result)

      reply.send({
        data: result?.id,
        message: 'Dolares asignados'
      })
    }
  }
}

module.exports = walletController
