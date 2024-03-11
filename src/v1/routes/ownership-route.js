/* eslint-disable spaced-comment */
/* eslint-disable no-trailing-spaces */

const ownershipModel = {
  id: { type: 'number' },
  name: { type: 'string' },
  location: { type: 'string' },
  description: { type: 'string' },
  photo: { type: 'string' },
  owner_id: { type: 'number' },
  property_id: { type: 'number' },
  owner_name: { type: 'string' }
}

const ownershipRoute = async (fastify, opts) => {
  const { ownershipController: controller, dashboardController } = fastify

  fastify.get(
    '/ownership',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Listado de todas las propiedades',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: ownershipModel
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.get_all_ownership
  )

  fastify.get(
    '/ownership/client/:accountId',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Obtener las propiedades de un cliente',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: ownershipModel
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getOwnershipsByAccountId
  )

  fastify.get(
    '/ownership/totalpriceyear/:id/:year',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Obtener el ingreso total por propiedad en el año especificado'
      },
      preHandler: [fastify.authenticate]
    },
    controller.getTotalPriceYearByOwner
  )

  fastify.get(
    '/ownership/count',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Obtener cantidad de propiedades',
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
    dashboardController.getOwnershipCount
  )

  fastify.get(
    '/ownership/reservations',
    {
      schema: {
        tags: ['ownership'],
        querystring: {
          from: { type: 'string' },
          to: { type: 'string' },
          page: { type: 'number' },
          nocache: { type: 'boolean' }
        }
      },

      preHandler: [fastify.authenticate]
    },
    controller.getReservations
  )

  fastify.get(
    '/ownership/totalpriceyear/all',
    {
      schema: {
        tags: ['ownership'],
        querystring: {
          year: { type: 'number' },
          nocache: { type: 'boolean' }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getTotalPriceByYear
  )

  fastify.get(
    '/ownership/totaloccupyyear/all',
    {
      schema: {
        tags: ['ownership'],
        description:
          'Obtener el total de ocupación por mes durante un año de todas las propiedades (%)',
        querystring: {
          year: { type: 'number' }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getOccupyPercentTotalByYear
  )

  fastify.get(
    '/ownership/totaloccupyyear',
    {
      schema: {
        tags: ['ownership'],
        description:
          'Obtener el total de ocupación por mes de una propiedad (%)',
        querystring: {
          year: { type: 'number' },
          id: { type: 'number' }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getOccupyPercentTotalById
  )

  fastify.put(
    '/ownership/totaloccupyyear/ids',
    {
      schema: {
        tags: ['ownership'],
        description:
          'Obtener el total de ocupacion por mes FROM lista de propiedades (%)',
        body: {
          type: 'object',
          required: ['year', 'ids'],
          properties: {
            year: { type: 'number' },
            ids: { type: 'array', items: { type: 'number' } }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getOccupyPercentTotalByIds
  )

  fastify.post(
    '/ownership',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Crear una propiedad',
        body: {
          type: 'object',
          required: [
            'name',
            'location',
            'description',
            'photo',
            'owner_id',
            'property_id'
          ],
          properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            photo: { type: 'string' },
            owner_id: { type: 'number' },
            property_id: { type: 'number' }
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
    controller.create_ownership
  )

  fastify.put(
    '/ownership',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Actualizar información de una propiedad',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            owner_id: { type: 'number' },
            property_id: { type: 'number' },
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            photo: { type: 'string' }
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
    controller.update_ownership
  )

  fastify.post(
    '/ownership/update_image',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Actualizar la imagen de una propiedad',
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
    '/ownership',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Eliminar una propiedad',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
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
    controller.delete_ownership
  )

  fastify.get(
    '/ownership/rates',
    {
      schema: {
        tags: ['ownership'],
        summary: 'Checar disponibilidad en calendarios',
        querystring: {
          apartment: { type: 'number', description: 'Property Id' },
          start_date: { type: 'string', description: '2022-10-24' },
          end_date: { type: 'string', description: '2022-10-25' }
        }
      },
      preHandler: [fastify.authenticate]
    },
    controller.getRate
  )
}

module.exports = ownershipRoute
