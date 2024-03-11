const { categoryRepository } = require('../repositories')

const categoryController = (fastify) => {
  const repo = categoryRepository(fastify)

  return {
    getAll: async (_, reply) => {
      const result = await repo.getAll()
      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create: async (request, reply) => {
      const result = await repo.create(request.body)
      if (!result) {
        return reply.code(400).send({
          message: 'No se pudo realizar la operación'
        })
      }

      reply.send({
        data: result,
        message: 'Categoría creada'
      })
    }
  }
}

module.exports = categoryController
