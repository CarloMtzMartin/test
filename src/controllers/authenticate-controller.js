const { accountRepository } = require('../repositories')
const { ACCOUNT_ROLE, ACCOUNT_STATUS } = require('../repositories/identifiers')
const { senderMail } = require('../services/malier')
const { generateRecoveryCode } = require('../services/recoverycode')

const authenticateController = (fastify) => {
  const repo = accountRepository(fastify)

  return {
    sign_in: async (request, reply) => {
      const { isMobile } = request.body

      const result = await repo.get_account_by_signing(request.body)

      if (!result) {
        return reply.code(400).send({
          message: 'Usuario o contraseña incorrecta'
        })
      }

      const isClient = result?.role === ACCOUNT_ROLE.CLIENT
      const isActiveClient = result?.status === ACCOUNT_STATUS.ACTIVE

      if (isMobile) {
        if (!isClient) {
          return reply.code(401).send({
            message: 'Inicio de sesión no permitido para operarios'
          })
        }
      } else { // Iniciando sesión desde el panel como usuario
        if (isClient) {
          return reply.code(401).send({
            message: 'Inicio de sesión no permitido para un clientes'
          })
        }
      }

      if (!isActiveClient) {
        return reply.code(401).send({
          message: 'Inicio de sesión no permitido'
        })
      }

      const { password, ...restInfo } = result

      const token = await fastify.jwt.sign({
        id: restInfo.id,
        email: restInfo.email
      })

      reply.send({
        data: {
          token,
          ...restInfo
        }
      })
    },

    recovery_code: async (request, reply) => {
      const { email } = request.body

      const account = await repo.getByEmail(email)
      if (!account) {
        return reply.code(200).send({
          message: 'Correo no existe'
        })
      }

      const code = generateRecoveryCode()

      senderMail({
        code,
        to: email,
        from: fastify.config.EMAILSENDER,
        senderPassword: fastify.config.SENDERPASSWORD
      })

      reply.code(200).send({
        data: {
          code,
          id: account.id
        },
        message: 'ok'
      })
    },

    recovery_password: async (request, reply) => {
      const { id, newpassword } = request.body

      const isOk = await repo.update_account({
        id,
        password: newpassword
      })

      if (!isOk) {
        return reply.code(400).send({
          message: 'No se pudo realizar la operación'
        })
      }

      reply.code(200).send({
        message: 'Contraseña actualizada correctamente'
      })
    }
  }
}

module.exports = authenticateController
