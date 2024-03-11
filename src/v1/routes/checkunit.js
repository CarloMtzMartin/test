const { fsUtils } = require('../../helpers')
const { senderMail } = require('../../services/malier')

const checkunitRoute = async (fastify, opts) => {
  fastify.post(
    '/uploadfile',
    {
      schema: {
        hide: true
      }
    },
    async (req, reply) => {
      const data = await req.file()
      const path = await fsUtils.readFile(data)
      reply.send({ path })
    }
  )

  fastify.post(
    '/uploadfiles',
    {
      schema: {
        hide: true
      }
    },
    async (req, reply) => {
      const data = await req.files()

      console.log(data)

      const paths = await fsUtils.readFiles(data)
      reply.send({ paths })
    }
  )

  fastify.post(
    '/test_decorator',
    {
      preHandler: [fastify.authenticate, fastify.asAdministrator]
    },
    async (request, reply) => {
      reply.send({ message: JSON.stringify(request.body) })
    }
  )

  fastify.get('/test_sendmail', {}, async (_, reply) => {
    senderMail({
      to: 'skilltrail@gmail.com',
      code: '633998'
    })
    reply.send({ message: 'Todo ready' })
  })

  fastify.get('/smoobu', {}, async (_, reply) => {
    const result = await fastify.smoobu.getUser()
    reply.send({ data: result, message: 'Ok' })
  })

  fastify.get('/smoobu_availability', {}, async (_, reply) => {
    const result = await fastify.smoobu.getApartmentAvailability({
      arrivalDate: '2022-11-01',
      departureDate: '2022-11-12',
      apartments: [1444661],
      customerId: 463754
    })
    reply.send({ data: result, message: 'Ok' })
  })

  fastify.get('/smoobu_rates', {}, async (_, reply) => {
    await fastify.smoobu.getRates({})

    reply.send({
      message: 'Ok'
    })
  })

  fastify.get('/smoobu_getapartmentsids', {}, async (_, reply) => {
    const data = await fastify.smoobu.getApartments()

    reply.send({
      data,
      message: 'Ok'
    })
  })

  fastify.get('/smoobu_reservations', {}, async (_, reply) => {
    const data = await fastify.smoobu.getReservations({})
    reply.send({
      data,
      message: 'OK'
    })
  })
}

module.exports = checkunitRoute
