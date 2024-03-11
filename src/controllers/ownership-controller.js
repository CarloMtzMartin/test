const { fsUtils, datelib } = require('../helpers')
const { ownershipRepository } = require('../repositories')
const { bookingsByYear } = require('./ownership/helper')

const ownershipController = (fastify) => {
  const repo = ownershipRepository(fastify)

  return {
    get_all_ownership: async (_, reply) => {
      const result = await repo.get_all_ownership()

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    get_all_ownership_by_owner_id: async (request, reply) => {
      const result = await repo.get_ownerships_by_owner_id(request.body)

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    create_ownership: async (request, reply) => {
      const resultId = await repo.create_ownership(request.body)

      if (!resultId) {
        return reply.code(400).send({
          message: 'Ha ocurrido un error'
        })
      }

      reply.send({
        data: {
          id: resultId
        },
        message: 'Propiedad creada y asignada'
      })
    },

    update_ownership: async (request, reply) => {
      const result = await repo.update_ownership(request.body)

      if (!result) {
        return reply.code(400).send({
          message:
            'No se pudo realizar la operación de actualizado de información de esta propiedad'
        })
      }

      reply.send({
        message: 'Actualizado exitoso'
      })
    },

    delete_ownership: async (request, reply) => {
      const result = await repo.delete_ownership(request.body)

      if (!result) {
        return reply.code(400).send({
          message:
            'No se pudo realizar la operación de actualizado de información de esta propiedad'
        })
      }

      reply.send({
        message: 'Operación exitosa'
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
      const { value: ownershipId } = data.fields.id

      const result = await repo.update_ownership({
        id: ownershipId,
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

    getRate: async (request, reply) => {
      const { apartment, start_date, end_date } = request.query

      const key = `${apartment}${start_date}${end_date}`

      let data = fastify.cache[key]

      if (!data) {
        data = await fastify.smoobu.getRates({
          apartments: [apartment],
          start_date,
          end_date
        })

        if (data) {
          fastify.cache[key] = JSON.stringify(data)
        }
      } else {
        data = JSON.parse(fastify.cache[key])
      }

      if (!data) {
        return reply.code(403).send({
          data: null,
          message: 'No se han encontrado datos'
        })
      }

      reply.code(200).send({
        data: data.data,
        message: 'Ok'
      })
    },

    getAvailability: async (request, reply) => {
      const { arrivalDate, departureDate, apartment } = request.body

      const key = `${arrivalDate}${departureDate}${apartment}`

      let data = fastify.cache[key]

      if (!data) {
        data = await fastify.smoobu.getApartmentAvailability({
          arrivalDate,
          departureDate,
          customerId: 463754,
          apartments: [apartment]
        })
      } else {
        data = JSON.parse(fastify.cache[key])
      }

      reply.code(200).send({
        data: data ?? null,
        message: 'Ok'
      })
    },

    getReservations: async (request, reply) => {
      const params = request.query
      const { from, to, page, nocache } = params

      const key = `${from}-${to}-${page}`

      let data = await fastify.cache.get(key)

      if (!data || !nocache) {
        data = await fastify.smoobu.getReservations({ from, to, page })
        await fastify.cache.append(key, data)
      }

      for (const reservation of data.bookings) {
        const id = reservation.id
        const property_id = reservation.apartment.id
        const price = reservation.price
        const created_at = reservation['arrival']
        const guest_name = reservation['guest-name']

        await fastify.emitter.appendMovementEmit({
          property_id,
          guest_name,
          opt_reservation_id: id,
          reservation_create_at: created_at,
          reservation_price: price
        })
      }

      reply.send({
        data,
        message: 'List'
      })
    },

    getTotalPriceByYear: async (request, reply) => {
      const params = request.query
      const { year: y, nocache } = params

      const year = parseInt(y)
      const bookings = await bookingsByYear({
        year,
        cache: fastify.cache,
        request: fastify.smoobu.getReservations
      })

      const reduceBookings = bookings.reduce((acc, el) => {
        const createYear = parseInt(el['arrival'].split('-')[0])
        if (createYear === year) {
          acc.push(el)
        }

        return acc
      }, [])

      const resultObject = reduceBookings.reduce(
        (acc, el) => {
          const month = datelib.getMonth(el['arrival'])

          const currentPrice = acc.month[month]
          acc.month[month] = (currentPrice ?? 0) + Math.floor(el.price)

          acc.total_year += Math.floor(el.price)
          return acc
        },
        { total_year: 0, month: {} }
      )

      reply.send({
        data: resultObject,
        message: 'Calculo entregado'
      })
    },

    getOwnershipsByAccountId: async (request, reply) => {
      const { accountId } = request.params

      const result = await repo.getByAccountId(accountId)

      reply.send({
        data: result,
        message: 'Lista entregada'
      })
    },

    getTotalPriceYearByOwner: async (request, reply) => {
      const { id, year: y } = request.params

      const year = parseInt(y)
      const apartmentId = parseInt(id)

      const bookings = await bookingsByYear({
        year,
        cache: fastify.cache,
        request: fastify.smoobu.getReservations
      })

      const reduceBookings = bookings.reduce((acc, el) => {
        const createYear = parseInt(el['arrival'].split('-')[0])
        if (createYear === year) {
          acc.push(el)
        }

        return acc
      }, [])

      const resultObject = reduceBookings.reduce(
        (acc, el) => {
          if (el.apartment.id !== apartmentId) {
            return acc
          }

          const month = datelib.getMonth(el['arrival'])

          const currentPrice = acc.month[month]
          acc.month[month] = (currentPrice ?? 0) + Math.floor(el.price)

          acc.total_year += Math.floor(el.price)

          return acc
        },
        { total_year: 0, month: {} }
      )

      reply.send({
        data: resultObject,
        message: 'Calculo entregado'
      })
    },

    getOccupyPercentTotalByIds: async (request, reply) => {
      const { year: y, ids } = request.body

      const year = parseInt(y)
      const bookings = await bookingsByYear({
        year,
        cache: fastify.cache,
        request: fastify.smoobu.getReservations
      })

      const reduceBookings = bookings.reduce((acc, el) => {
        const createYear = parseInt(el['arrival'].split('-')[0])
        if (createYear === year) {
          acc.push(el)
        }

        return acc
      }, [])

      const objectMonth = reduceBookings.reduce(
        (acc, el) => {
          if (!ids.includes(el.apartment.id)) {
            return acc
          }

          const month = datelib.getMonth(el['arrival'])

          const currentValue = acc.month[month] ?? 0
          acc.month[month] = currentValue + 1

          return acc
        },
        { month: {} }
      )

      const finalObject = Object.entries(objectMonth.month).reduce(
        (acc, [kMonth, vCount]) => {
          const daysOfMonth = datelib.getDaysOfMonth({ month: kMonth, year })
          const currentValue = vCount

          acc.month[kMonth] = Math.min(
            100,
            Math.floor((currentValue * 100) / daysOfMonth)
          )

          return acc
        },
        { month: {} }
      )

      reply.send({
        data: finalObject,
        message: 'Calculado'
      })
    },

    getOccupyPercentTotalById: async (request, reply) => {
      const { year, id } = request.query

      const bookings = await bookingsByYear({
        year,
        cache: fastify.cache,
        request: fastify.smoobu.getReservations
      })

      const reduceBookings = bookings.reduce((acc, el) => {
        const createYear = parseInt(el['arrival'].split('-')[0])
        if (createYear === year) {
          acc.push(el)
        }

        return acc
      }, [])

      const objectMonth = reduceBookings.reduce(
        (acc, el) => {
          if (id !== el.apartment.id) {
            return acc
          }

          const month = datelib.getMonth(el['arrival'])

          const currentValue = acc.month[month] ?? 0
          acc.month[month] = currentValue + 1

          return acc
        },
        { month: {} }
      )

      const finalObject = Object.entries(objectMonth.month).reduce(
        (acc, [kMonth, vCount]) => {
          const daysOfMonth = datelib.getDaysOfMonth({ month: kMonth, year })
          const currentValue = vCount

          acc.month[kMonth] = Math.min(
            100,
            Math.floor((currentValue * 100) / daysOfMonth)
          )

          return acc
        },
        { month: {} }
      )

      reply.send({
        data: finalObject,
        message: 'Calculado'
      })
    },

    getOccupyPercentTotalByYear: async (request, reply) => {
      const { year } = request.query

      const bookings = await bookingsByYear({
        year,
        cache: fastify.cache,
        request: fastify.smoobu.getReservations
      })

      const reduceBookings = bookings.reduce((acc, el) => {
        const createYear = parseInt(el['arrival'].split('-')[0])
        if (createYear === year) {
          acc.push(el)
        }

        return acc
      }, [])

      const objectMonth = reduceBookings.reduce(
        (acc, el) => {
          const month = datelib.getMonth(el['arrival'])

          const currentValue = acc.month[month] ?? 0
          acc.month[month] = currentValue + 1

          return acc
        },
        { month: {} }
      )

      const finalObject = Object.entries(objectMonth.month).reduce(
        (acc, [kMonth, vCount]) => {
          const daysOfMonth = datelib.getDaysOfMonth({ month: kMonth, year })
          const currentValue = vCount

          acc.month[kMonth] = Math.min(
            100,
            Math.floor((currentValue * 100) / daysOfMonth)
          )

          return acc
        },
        { month: {} }
      )

      reply.send({
        data: finalObject,
        message: 'Calculado'
      })
    }
  }
}

module.exports = ownershipController
