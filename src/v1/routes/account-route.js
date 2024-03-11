const userModel = {
  id: { type: 'number' },
  role: { type: 'number' },
  status: { type: 'number' },
  name: { type: 'string' },
  email: { type: 'string' },
  location: { type: 'string' },
  phone: { type: 'string' },
  photo: { type: 'string' },
  subcribe_at: { type: 'string' },
  create_at: { type: 'string' }
}

const accountRoute = async (fastify, options) => {
  const { accountController, dashboardController } = fastify

  fastify.get(
    '/account',
    {
      schema: {
        tags: ['account'],
        summary: 'Lista de todos los usuarios',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ...userModel,
                    ownerships: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          name: { type: 'string' },
                          location: { type: 'string' },
                          description: { type: 'string' },
                          photo: { type: 'string' },
                          property_id: { type: 'number' },
                          owner_id: { type: 'number' }
                        }
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
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    accountController.get_all_account
  )

  fastify.get(
    '/account/:id',
    {
      schema: {
        tags: ['account'],
        summary: 'Obtener la información de un usuario',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  ...userModel,
                  ownerships: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        location: { type: 'string' },
                        description: { type: 'string' },
                        photo: { type: 'string' },
                        owner_id: { type: 'number' },
                        property_id: { type: 'number' }
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
    accountController.get_account_information
  )

  fastify.get(
    '/account/dashboard/status',
    {
      schema: {
        tags: ['account'],
        summary: 'Obtener la cantidad de usuarios activos e inactivos',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  active: { type: 'number' },
                  deactive: { type: 'number' }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    dashboardController.getClientByStatus
  )

  fastify.post(
    '/account',
    {
      schema: {
        tags: ['account'],
        summary: 'Crear un usuario',
        body: {
          type: 'object',
          required: [
            'name',
            'email',
            'password',
            'phone',
            'location',
            'subcribe_at'
          ],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'number', minimum: 1, maximum: 5 },
            password: { type: 'string' },
            location: { type: 'string' },
            phone: { type: 'string' },
            subcribe_at: { type: 'string' }
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
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    accountController.create_user
  )

  fastify.put(
    '/account',
    {
      schema: {
        tags: ['account'],
        summary: 'Editar un usuario',
        description:
          'Esta operación solo la puede hacer un usuario con ROL de administrador',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
            password: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            create_at: { type: 'string' }
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
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    accountController.update_account
  )

  fastify.put(
    '/account/:id/:action',
    {
      schema: {
        tags: ['account'],
        summary: 'Editar estatus del usuario',
        description:
          'Valores esperados para el param :action son [active - deactive] (ADMIN)',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { tpe: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    accountController.toggle_active
  )

  fastify.post(
    '/account/update_image',
    {
      schema: {
        tags: ['account'],
        summary: 'Actualizar la imagen de un usuario',
        description: 'Los campos del multipart: ["id", "file"]',
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  image: { type: 'string' }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      },
      preHandler: [fastify.authenticate]
    },
    accountController.update_image
  )

  /*
  fastify.delete(
    '/account',
    {
      schema: {
        tags: ['account'],
        summary: 'Eliminar un usuario',
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
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    accountController.delete_user
  )
  */
}

module.exports = accountRoute
