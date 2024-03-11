const interestAdvertisingRoute = async (fastify, opts) => {
  const { interestAdvertisingController: controller } = fastify

  fastify.get(
    '/interest_advertising',
    {
      schema: {
        tags: ['in_advertising'],
        summary: 'Lista de los usuarios que le interesan la publicidad',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  properties: {
                    id: { type: 'number' },
                    contact_by: { type: 'number' },
                    account_id: { type: 'number' },
                    advertising_id: { type: 'number' },
                    create_at: { type: 'string' },
                    contact: {
                      type: ['object', 'null'],
                      properties: {
                        id: { type: 'number' },
                        role: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        location: { type: 'string' },
                        phone: { type: 'string' },
                        photo: { type: 'string' }
                      }
                    },
                    account: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        role: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        location: { type: 'string' },
                        phone: { type: 'string' },
                        photo: { type: 'string' }
                      }
                    },
                    advertising: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        photo: { type: 'string' }
                      }
                    }
                  }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.get_all
  )

  fastify.post(
    '/interest_advertising',
    {
      schema: {
        tags: ['in_advertising'],
        summary: 'Crear una solicitud de interés por una publicidad',
        body: {
          type: 'object',
          required: ['account_id', 'advertising_id'],
          properties: {
            account_id: { type: 'number' },
            advertising_id: { type: 'number' }
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
    '/interest_advertising',
    {
      schema: {
        tags: ['in_advertising'],
        summary: 'Actualizar información de una solicitud de publicidad',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            contact_by: { type: 'number' },
            account_id: { type: 'number' },
            advertising_id: { type: 'number' }
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

  fastify.delete(
    '/interest_advertising',
    {
      schema: {
        tags: ['in_advertising'],
        summary: 'Eliminar una solicitud de publicidad',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
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
    controller.remove
  )
}

module.exports = interestAdvertisingRoute
