const pickupModel = {
  id: { type: 'number' },
  account_id: { type: 'number' },
  name: { type: 'string' },
  arrival_at: { type: 'string' },
  create_at: { type: 'string' },
  status: { type: 'number' }
}

const pickupRoute = async (fastify, opts) => {
  const { pickupController } = fastify

  fastify.get(
    '/pickup',
    {
      schema: {
        tags: ['pickup'],
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: pickupModel,
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    pickupController.get_all_pickup
  )

  fastify.get(
    '/pickup/:id',
    {
      schema: {
        tags: ['pickup'],
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: pickupModel,
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    pickupController.getByAccountId
  )

  fastify.post(
    '/pickup',
    {
      schema: {
        tags: ['pickup'],
        body: {
          type: 'object',
          required: ['account_id', 'arrival_at'],
          properties: {
            account_id: { type: 'number' },
            arrival_at: { type: 'string' }
          }
        },
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
    pickupController.create_pickup
  )

  fastify.put(
    '/pickup',
    {
      schema: {
        tags: ['pickup'],
        body: {
          type: 'object',
          required: ['id', 'status'],
          properties: {
            id: { type: 'number' },
            status: { type: 'number' }
          }
        },
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
    pickupController.update_pickup
  )
}

module.exports = pickupRoute
