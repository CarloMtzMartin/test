const { getCurrentYear } = require('../helpers/datelib')
const {
  accountRepository,
  ownershipRepository,
  movementRepository
} = require('../repositories')
const { ACCOUNT_ROLE } = require('../repositories/identifiers')
// Gastos -> Total de gasto por mes
// By Category

// ingresos anuales

// porcentaje ocupacion de propiedades anual

const dashboardController = (fastify) => {
  const repoAccount = accountRepository(fastify)
  const repoOwnership = ownershipRepository(fastify)
  const repoMovement = movementRepository(fastify)

  return {
    getClientByStatus: async (_, reply) => {
      const results = await repoAccount.getAccountStatus()

      const clients = results.filter((el) => el.role === ACCOUNT_ROLE.CLIENT)

      const obj = {
        active: clients.filter((el) => !el.status).length,
        deactive: clients.filter((el) => el.status).length
      }

      reply.send({
        data: obj,
        message: 'Lista entregada'
      })
    },

    getOwnershipCount: async (_, reply) => {
      const results = await repoOwnership.get_all_ownership()
      reply.send({
        data: results.length,
        message: 'Conteo entregado'
      })
    },

    getBillsByMonth: async (request, reply) => {
      const { month, year } = request.params
      const results = await repoMovement.getByMonth({
        month,
        year: year ?? getCurrentYear()
      })

      const entities = {
        month,
        bycategory: results.reduce((acc, el) => {
          acc[el.category] = el
          return acc
        }, {})
      }

      reply.send({
        data: entities,
        message: 'Lista entregada'
      })
    }
  }
}

module.exports = dashboardController
