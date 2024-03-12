/* eslint-disable no-unused-vars */
const fp = require('fastify-plugin')

// const localDb = 'mysql://root:123456@core-database:3306/dreamdb'
// const serverDb = 'mysql://dream:123456@localhost:3306/dreamdb'
const serverDb = 'mysql://justatest_seeliongas:a914825f6bd1dbfd7c1e3c293cddb6a6e0f536b6@8kx.h.filess.io:3306/justatest_seeliongas'

const mysqlPlugin = async (fastify, options) => {
  fastify.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: serverDb
  })
}

module.exports = fp(mysqlPlugin)
