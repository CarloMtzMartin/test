const fp = require('fastify-plugin')

const AwaitEventEmitter = require('await-event-emitter').default

const {
  walletRepository,
  movementRepository,
  ownershipRepository
} = require('../repositories')
const { makeMovement } = require('../controllers/movement/helper')
const { MOVEMENT_TYPE } = require('../repositories/identifiers')
const { fullDatetimeNow } = require('../helpers/datelib')

const eventPlugin = (fastify, _, next) => {
  const emitter = new AwaitEventEmitter()

  const repoWallet = walletRepository(fastify)
  const repoOwnership = ownershipRepository(fastify)
  const repoMovement = movementRepository(fastify)

  emitter.on(
    'appendMovementFromReservation',
    async function({
      opt_reservation_id,
      reservation_create_at,
      reservation_price,
      property_id,
      guest_name
    }) {
      // console.log({
      //   opt_reservation_id,
      //   reservation_create_at,
      //   reservation_price,
      //   property_id,
      //   guest_name
      // })

      const ownership = await repoOwnership.getByPropertyId(property_id)

      if (!ownership) {
        return
      }

      // TODO: Agregar nombre explicito del author de la reservacion

      const [description, concept, category, author, amount] = [
        'Reservación de una propiedad',
        'Reservación',
        -1,
        105,
        reservation_price
      ]

      const movement = {
        concept,
        category,
        description,
        author,
        type: MOVEMENT_TYPE.IN,
        amount,
        ownership_id: ownership.id,
        create_at: reservation_create_at,
        opt_reservation_id
      }

      const result = await makeMovement({
        movement,
        repoMovement,
        repoWallet,
        repoOwnership,
        type: MOVEMENT_TYPE.IN
      })
    }
  )

  emitter.on('deleteMovement', async function(movement) {
    const sum = (x, y) => x + y
    const { ownership_id } = movement
    const wallet = await repoWallet.getByOwnershipId(ownership_id)

    const operation = sum

    const current_money = operation(wallet.amount, movement.amount)

    const result = await repoWallet.update({
      id: wallet.id,
      amount: current_money,
      update_at: fullDatetimeNow()
    })
  })

  const deleteMovementEmit = async (payload) => {
    await emitter.emit('deleteMovement', payload)
  }

  const appendMovementEmit = async (payload) => {
    await emitter.emit('appendMovementFromReservation', payload)
  }

  fastify.emitter = {
    appendMovementEmit,
    deleteMovementEmit
  }

  console.log('Emitter Actived')

  next()
}

module.exports = fp(eventPlugin)
