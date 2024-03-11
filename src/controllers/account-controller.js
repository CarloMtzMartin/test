const { fsUtils } = require('../helpers')
const { accountRepository } = require('../repositories')
const { ACCOUNT_STATUS } = require('../repositories/identifiers')

const accountController = (fastify) => {
  const repo = accountRepository(fastify)

  return {
    get_all_account: async (_, reply) => {
      const result = await repo.get_all_account()
      if (!result) {
        return reply.code(500).send({
          message: 'Error interno'
        })
      }

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    get_account_information: async (request, reply) => {
      const { id } = request.params
      const result = await repo.getAccountInformationById({ id })
      if (!result) {
        return reply.code(404).send({
          message: 'Usuario no encontrado'
        })
      }

      reply.send({
        data: result,
        message: 'OK'
      })
    },

    create_user: async (request, reply) => {
      const result = await repo.create_account(request.body)

      if (!result) {
        return reply.code(400).send({
          message: 'Usuario ya éxiste'
        })
      }

      reply.send({
        message: 'Usuario creado con éxito'
      })
    },

    update_account: async (request, reply) => {
      const result = await repo.update_account(request.body)

      if (!result) {
        return reply.code(406).send({
          message:
            'No se pudo realizar la operación de actualizado de información de la cuenta'
        })
      }

      reply.send({
        message: 'Actualizado exitoso'
      })
    },

    update_user_role: async (request, reply) => {
      const result = await repo.update_account(request.body)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación de actualizado de rol'
        })
      }

      reply.send({
        message: 'Rol actualizado correctamente'
      })
    },

    delete_user: async (request, reply) => {
      const result = await repo.delete_account({ id: request.body.id })

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación de eliminar el usuario'
        })
      }

      reply.send({
        message: 'Usuario eliminado exitosamente'
      })
    },

    toggle_active: async (request, reply) => {
      const { id, action } = request.params

      const actionObject = {
        active: { status: ACCOUNT_STATUS.ACTIVE },
        deactive: { status: ACCOUNT_STATUS.DEACTIVE }
      }[action]

      if (!actionObject) {
        return reply.code(404).send({
          message: 'No se puede realizar esta operación'
        })
      }

      const objRequest = Object.assign({ id }, actionObject)
      const result = await repo.update_account(objRequest)

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo realizar la operación de eliminar el usuario'
        })
      }

      reply.code(200).send({
        message: 'Operación realizada éxitosamente'
      })
    },

    update_image: async (request, reply) => {
      const data = await request.file()
      const ruleField = ['id', 'file'].join('')
      const inField = Object.keys(data.fields).join('')
      if (inField !== ruleField) {
        return reply.code(406).send({
          message: 'Multipart con campos inválidos'
        })
      }

      const path = await fsUtils.readFile(data)
      const { value: accountId } = data.fields.id

      const result = await repo.update_account({
        id: accountId,
        photo: path
      })

      if (!result) {
        return reply.code(406).send({
          message: 'No se pudo relizar la operación'
        })
      }

      reply.code(200).send({
        data: {
          image: path
        },
        message: 'Imagen actualizada exitosamente'
      })
    }
  }
}

module.exports = accountController
