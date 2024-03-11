const fp = require('fastify-plugin')
const apiCreator = require('../services/smoobu')

const smoobuPlugin = (fastify, _, next) => {
  const api = apiCreator({ apikey: fastify.config.SMOOBU_APIKEY })

  fastify.smoobu = api

  next()
}

module.exports = fp(smoobuPlugin)
