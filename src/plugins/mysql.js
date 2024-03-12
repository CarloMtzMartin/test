/* eslint-disable no-unused-vars */
const fp = require('fastify-plugin')

// const localDb = 'mysql://root:123456@core-database:3306/dreamdb'
// const serverDb = 'mysql://dream:123456@localhost:3306/dreamdb'
const serverDb = 'mysql://freedb_dream:%dt@Hm98!Wt!yNG@sql.freedb.tech:3306/freedb_just_a_test'

const mysqlPlugin = async (fastify, options) => {
  fastify.register(require('@fastify/mysql'), {
    promise: true,
    connectionString: serverDb
  })
}

module.exports = fp(mysqlPlugin)
