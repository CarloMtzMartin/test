const fp = require('fastify-plugin')

const swaggerPlugin = async (fastify, options) => {
  fastify.register(require('@fastify/swagger'), {
    exposeRoute: true,
    routePrefix: '/documentation',
    swagger: {
      info: { title: 'Dreambuilt API', verison: '1.0.0' },
      basePath: '/api/',
      tags: [
        {
          name: 'authenticate',
          description: 'Autenticación'
        },

        {
          name: 'account',
          description: 'Cuenta y todas las operaciones disponibles'
        },

        {
          name: 'advertising',
          description: 'Publicidad'
        },

        {
          name: 'in_advertising',
          description: 'Usuarios que solicitan publicidad'
        },

        {
          name: 'ownership',
          description: 'Propiedades'
        },
        {
          name: 'pickup',
          description: 'Pickup servicio'
        },
        {
          name: 'movement',
          description: 'Movimiento de gastos'
        },
        {
          name: 'category',
          description: 'Categoría para gastos'
        },
        {
          name: 'stay',
          description: 'Estadía'
        }
      ],
      schemes: ['https', 'http'],
      securityDefinitions: {
        apiKey: {
          type: 'Bearer',
          name: 'JWT',
          in: 'header'
        }
      },
      definitions: {
        Account: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            status: { type: 'number' },
            role: { type: 'number' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            name: { type: 'string' },
            location: { type: 'string' },
            phone: { type: 'string', format: 'phone' },
            photo: { type: 'string' },
            subcribe_at: { type: 'string', format: 'timestamp' },
            create_at: { type: 'string', format: 'timestamp' }
          }
        },
        Ownership: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            owner_id: { type: 'number', format: 'Account' },
            property_id: { type: 'number' },
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            photo: { type: 'string' }
          }
        },
        Advertising: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            photo: { type: 'string' },
            mount: { type: 'boolean' },
            create_at: { type: 'timestamp' }
          }
        },
        Interest_Advertising: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            contact_by: { type: 'number', format: 'admin_email' },
            account_id: { type: 'number', format: 'client' },
            advertising_id: { type: 'number', format: 'Advertising' },
            create_at: { type: 'timestamp' }
          }
        },
        Pickup: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            account_id: { type: 'number', format: 'client' },
            status: { type: 'number' },
            arrival_at: { type: 'string', format: 'timestamp' },
            create_at: { type: 'timestamp' }
          }
        },
        Movement: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            ownership_id: { type: 'number' },
            author: { type: 'number' },
            amount: { type: 'number' },
            category: { type: 'number' },
            description: { type: 'string' },
            concept: { type: 'string' },
            create_at: { type: 'string' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            category: { type: 'string' }
          }
        },
        Stay: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            ownership_id: { type: 'number' },
            account_id: { type: 'number' },
            status: { type: 'number' },
            arrival_at: { type: 'string' },
            departure_at: { type: 'string' }
          }
        }
      }
    }
  })
}

module.exports = fp(swaggerPlugin)
