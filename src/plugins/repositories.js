const fp = require('fastify-plugin')

const { accountRepository } = require('../repositories')

const repositoriesPlugin = async (fastify, opts) => {
  fastify.decorate('accountRepository', accountRepository(fastify))
}

module.exports = fp(repositoriesPlugin)
