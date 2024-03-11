const fp = require('fastify-plugin')

const {
  authenticateController,
  accountController,
  advertisingController,
  ownershipController,
  pickupController,
  interestAdvertisingController,
  categaryController,
  movementController,
  stayController,
  dashboardController,
  walletController,
  utilController
} = require('../controllers')

const controllersPlugin = async (fastify, opts) => {
  fastify.decorate('authenticateController', authenticateController(fastify))
  fastify.decorate('accountController', accountController(fastify))
  fastify.decorate('advertisingController', advertisingController(fastify))
  fastify.decorate('ownershipController', ownershipController(fastify))
  fastify.decorate('pickupController', pickupController(fastify))
  fastify.decorate(
    'interestAdvertisingController',
    interestAdvertisingController(fastify)
  )
  fastify.decorate('categoryController', categaryController(fastify))
  fastify.decorate('movementController', movementController(fastify))
  fastify.decorate('stayController', stayController(fastify))
  fastify.decorate('dashboardController', dashboardController(fastify))
  fastify.decorate('walletController', walletController(fastify))
  fastify.decorate('utilController', utilController(fastify))
}

module.exports = fp(controllersPlugin)
