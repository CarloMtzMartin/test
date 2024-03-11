const categoryRoute = async (fastify) => {
  const { categoryController: controller } = fastify

  fastify.get(
    '/category',
    {
      schema: {
        tags: ['category'],
        summary: 'Listado de categorías',
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
                    category: { type: 'string' }
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
    controller.getAll
  )

  fastify.post(
    '/category',
    {
      schema: {
        tags: ['category'],
        summary: 'Crear categoría para gastos',
        body: {
          type: 'object',
          properties: {
            category: { type: 'string' }
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
}

module.exports = categoryRoute
