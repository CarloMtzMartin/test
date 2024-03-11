const { fsUtils } = require('../helpers')
const { advertisingRepository } = require('../repositories')

const advertisingController = (fastify) => {
  const repo = advertisingRepository(fastify)

  return {
    get_all: async (_, reply) => {
      const result = await repo.get_all()
      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create: async (request, reply) => {
      const resultId = await repo.create(request.body)

      if (!resultId) {
        return reply.code(400).send({
          message: 'Ocurrió un error'
        })
      }

      reply.send({
        data: {
          id: resultId
        },
        message: 'Publicidad creada éxitosamente'
      })
    },

    update: async (request, reply) => {
      const result = await repo.update(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.send({
        message: 'Actualizado exitoso'
      })
    },

    update_image: async (request, reply) => {
      const data = await request.file()

      // validate fields formdata
      const ruleField = ['id', 'file'].join('')
      const inField = Object.keys(data.fields).join('')
      if (inField !== ruleField) {
        return reply.code(406).send({
          message: 'Multipart con campos inválidos'
        })
      }

      const path = await fsUtils.readFile(data)
      const { value: advertisingId } = data.fields.id

      const result = await repo.update({
        id: advertisingId,
        photo: path
      })

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.code(200).send({
        message: 'Imagen actualizada exitosamente'
      })
    },

    unmount: async (request, reply) => {
      const result = await repo.update({
        id: request.params.id,
        mount: 0
      })

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.send({
        message: 'Operación exitosa'
      })
    },

    remove: async (request, reply) => {
      const result = await repo.remove(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación'
        })
      }

      reply.send({
        message: 'Publicidad eliminada existosamente'
      })
    }
  }
}

module.exports = advertisingController
