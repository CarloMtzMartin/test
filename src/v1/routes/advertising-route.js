const advertisingRoute = async (fastify, opts) => {
  const { advertisingController } = fastify

  fastify.get(
    '/advertising',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Lista de todas las publicidades',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    photo: { type: 'string' },
                    mount: { type: 'boolean' },
                    create_at: { type: 'string' }
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
    advertisingController.get_all
  )

  fastify.get(
    '/advertising/unmount/:id',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Quitar la publicación de las principales',
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
    advertisingController.unmount
  )

  fastify.post(
    '/advertising',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Crear una publicidad',
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            photo: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    advertisingController.create
  )

  fastify.put(
    '/advertising',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Editar una publicidad',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
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
    advertisingController.update
  )

  fastify.post(
    '/advertising/update_image',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Actualizar la imagen de una publicidad',
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
    advertisingController.update_image
  )

  fastify.delete(
    '/advertising',
    {
      schema: {
        tags: ['advertising'],
        summary: 'Eliminar una publicidad',
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
    advertisingController.remove
  )
}

module.exports = advertisingRoute
