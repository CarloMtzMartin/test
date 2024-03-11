const staySchema = {
  id: { type: 'number' },
  ownership_id: { type: 'number' },
  account_id: { type: 'number' },
  status: { type: 'number' },
  arrival_at: { type: 'string' },
  departure_at: { type: 'string' },
  create_at: { type: 'string' }
}

const stayRoute = async (fastify) => {
  const { stayController: controller } = fastify

  fastify.get(
    '/stay',
    {
      schema: {
        tags: ['stay'],
        summary: 'Lista de todas las estadias',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  properties: staySchema
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getAll
  )

  fastify.get(
    '/stay/:field/:id',
    {
      schema: {
        tags: ['stay'],
        summary: 'Lista de todas las estadias',
        description: ':field (account, ownership)',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  properties: staySchema
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getByFieldId
  )

  fastify.post(
    '/stay',
    {
      schema: {
        tags: ['stay'],
        summary: 'Crear un registro de estadia',
        body: {
          type: 'object',
          properties: {
            ownership_id: { type: 'number' },
            account_id: { type: 'number' },
            arrival_at: { type: 'string' },
            departure_at: { type: 'string' }
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
    controller.create
  )

  fastify.put(
    '/stay',
    {
      schema: {
        tags: ['stay'],
        summary: 'Actualizar un registro de estadia',
        body: {
          type: 'object',
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
    controller.update
  )
}

module.exports = stayRoute
