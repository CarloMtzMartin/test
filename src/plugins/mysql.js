/* eslint-disable no-unused-vars */
const fp = require('fastify-plugin')

const localDb = 'mysql://root:123456@core-database:3306/dreamdb'
const serverDb = 'mysql://dream:123456@localhost:3306/dreamdb'

const mysqlPlugin = async (fastify, options) => {
  fastify.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: serverDb
  })
}

module.exports = fp(mysqlPlugin)
