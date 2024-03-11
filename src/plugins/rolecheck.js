const fp = require('fastify-plugin')
const { accountRepository, identifiers } = require('../repositories')
const { ACCOUNT_ROLE } = identifiers

const rolecheckPlugin = async (fastify) => {
  fastify.decorate('asAdministrator', async (request, _, done) => {
    const repo = accountRepository(fastify)
    const { userId } = request

    //console.log('information', userId)
    const user = await repo.getAccountById(userId)

    if (!user) {
      done(new Error('User not found'))
    }

    if (
      ![
        ACCOUNT_ROLE.ADMINISTRATOR,
        ACCOUNT_ROLE.FINANCE,
        ACCOUNT_ROLE.OPERATOR,
        ACCOUNT_ROLE.ADVERTISING
      ].includes(user.role)
    ) {
      done(new Error('No tienes permisos para realizar esta operación'))
    }
  })
}

module.exports = fp(rolecheckPlugin)
