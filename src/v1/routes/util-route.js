const utilRoute = async (fastify, opts) => {
  const { utilController } = fastify

  fastify.post(
    '/util/smoobu_direct',
    {
      preHandler: [fastify.authenticate]
    },
    utilController.bridgeSmoobuRequest
  )

  fastify.post(
    '/util/notification',
    {
      schema: {
        summary: 'Pueden emitir una notificación al correo de actividades',
        description:
          `typeNotify: STAY_REQUEST, STAY_CANCELED, PICKUP_REQUEST, PICKUP_CANCELED, ADVERTISING_REQUEST\n
        STAY(Estadía)\n
        PICKUP(Pick up)\n
        ADVERTISING(Publicidad)`,
        body: {
          type: 'object',
          required: ['name', 'email', 'phone', 'typeNotify'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            typeNotify: { type: 'string' }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    utilController.sendNotification
  )
}

module.exports = utilRoute
