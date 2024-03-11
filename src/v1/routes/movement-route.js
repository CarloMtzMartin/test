const movementModel = {
  id: { type: 'number' },
  category: { type: 'number' },
  author: { type: 'number' },
  ownership_id: { type: 'number' },
  amount: { type: 'number' },
  current_money: { type: 'number' },
  type: { type: 'number' },
  concept: { type: 'string' },
  photo: { type: 'string' },
  description: { type: 'string' },
  create_at: { type: 'string' }
}

const movementRoute = async (fastify) => {
  const { movementController: controller, dashboardController, walletController } = fastify

  fastify.get(
    '/movement/month/:month/:year',
    {
      schema: {
        tags: ['movement'],
        summary: 'Ver movimientos por mes, clasificados por categoría',
        description: 'bycategory es una entidad { [category]: [movement] }',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {},
              message: { type: 'string' }
            }
          }
        }
      }
    },
    dashboardController.getBillsByMonth
  )

  fastify.get(
    '/movement/:id',
    {
      schema: {
        tags: ['movement'],
        summary: 'Ver los movimientos de una propiedad',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: movementModel
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getByOwnership
  )

  fastify.get(
    '/movement/ownership/:ownershipid/:month/:year',
    {
      tags: ['movement'],
      summary: 'Ver los movimientos de una propiedad por mes',
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: movementModel
              }
            },
            message: { type: 'string' }
          }
        }
      }
    },
    controller.getMonthByOwnershipId
  )

  fastify.get(
    '/movement/account/:accountid/:month/:year',
    {
      schema: {
        tags: ['movement'],
        summary:
          'Ver los movimientos de un cliente por todas sus propiedades por mes',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: movementModel
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getMonthByAccountId
  )

  fastify.post(
    '/movement',
    {
      schema: {
        tags: ['movement'],
        summary: 'Crear movimiento de gasto',
        body: {
          type: 'object',
          properties: {
            concept: { type: 'string' },
            description: { type: 'string' },
            create_at: { type: 'string' },
            category: { type: 'number' },
            ownership_id: { type: 'number' },
            opt_reservation_id: { type: 'number' },
            author: { type: 'number' },
            amount: { type: 'number' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'number' },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.create
  )

  fastify.post(
    '/movement/usd_balance',
    {
      schema: {
        tags: ['movement'],
        summary: 'Crear balance en USD',
        body: {
          type: 'object',
          properties: {
            update_at: { type: 'string' },
            ownership_id: { type: 'number' },
            account_id: { type: 'number' },
            usd_amount: { type: 'number' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'number' },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    walletController.setUSD
  )

  fastify.post(
    '/movement/update_image',
    {
      schema: {
        tags: ['movement'],
        summary: 'Actualizar la imagen de un movimiento',
        description: 'Los campos del multipart: ["id", "file"]',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.update_image
  )

  fastify.delete(
    '/movement',
    {
      schema: {
        tags: ['movement'],
        summary: 'Eliminar un movimiento',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.remove
  )
}

module.exports = movementRoute
