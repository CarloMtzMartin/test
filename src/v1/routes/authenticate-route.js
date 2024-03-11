const authenticateRoute = async (fastify, options) => {
  const { authenticateController } = fastify

  fastify.post(
    '/signin',
    {
      schema: {
        tags: ['authenticate'],
        body: {
          type: 'object',
          required: ['email', 'password', 'isMobile'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            isMobile: { type: 'number' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  status: { type: 'integer' },
                  role: { type: 'integer' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  location: { type: 'string' },
                  phone: { type: 'string' },
                  photo: { type: 'string' },
                  create_at: { type: 'string' },
                  token: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    authenticateController.sign_in
  )

  fastify.post(
    '/recoverycode',
    {
      schema: {
        tags: ['authenticate'],
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  id: { type: 'number' }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    authenticateController.recovery_code
  )

  fastify.post(
    '/recoverypassword',
    {
      schema: {
        tags: ['authenticate'],
        body: {
          type: 'object',
          required: ['id', 'newpassword'],
          properties: {
            id: { type: 'number' },
            newpassword: { type: 'string' }
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
      }
    },
    authenticateController.recovery_password
  )
}

module.exports = authenticateRoute
