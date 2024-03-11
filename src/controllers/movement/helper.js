const { fullDatetimeNow } = require('../../helpers/datelib')
const { MOVEMENT_TYPE } = require('../../repositories/identifiers')

const sum = (x, y) => x + y
const sub = (x, y) => x - y

const makeMovement = async ({
  repoWallet,
  repoMovement,
  repoOwnership,
  movement,
  type
}) => {
  const { ownership_id } = movement

  let wallet = await repoWallet.getByOwnershipId(ownership_id)
  let walletId = wallet?.id

  if (!wallet) {
    // should be create wallet
    const ownership = await repoOwnership.getById(ownership_id)
    if (!ownership) {
      return { error: true, message: 'No se pudo realizar operación 1' }
    }

    walletId = await repoWallet.create({
      ownership_id,
      account_id: ownership.owner_id,
      amount: 0,
      usd_amount: 0
    })

    if (!walletId) {
      return { error: true, message: 'No se pudo realizar operación 2' }
    }

    wallet = await repoWallet.getByOwnershipId(ownership_id)
  }

  const operation = type === MOVEMENT_TYPE.IN ? sum : sub

  const current_money = operation(wallet.amount, movement.amount)

  let new_id = -1
  if (type === MOVEMENT_TYPE.OUT) {
    const body = Object.assign(movement, {
      current_money,
      type: MOVEMENT_TYPE.OUT
    })

    console.log('BODY', body)

    const result = await repoMovement.create(body)
    if (!result) {
      return { error: true, message: 'No se pudo realizar operación 3' }
    }

    // asign new_id
    new_id = result
  } else {
    // ingreso
    const body = Object.assign(movement, {
      current_money
    })

    const result = await repoMovement.create_verified(body)

    if (!result) {
      return {
        error: true,
        message: 'No se pudo agregar movimiento de ingreso'
      }
    }
  }

  {
    const isOk = await repoWallet.update({
      id: walletId,
      amount: current_money,
      update_at: fullDatetimeNow()
    })

    if (!isOk) {
      return { error: true, message: 'No se pudo realizar operación 4' }
    }
  }

  return { id: new_id, error: false }
}

module.exports = {
  makeMovement
}
