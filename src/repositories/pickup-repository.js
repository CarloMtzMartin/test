const pickupRepository = (fastify) => {
  const { mysql } = fastify

  const get_pickup_by_id = async (id) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM pickup WHERE id=?', [id])
      return rows.length ? rows[0] : null
    } catch (err) {
      return null
    }
  }

  return {
    getByAccountId: async (id) => {
      try {
        const [rows] = await mysql.query(
          'SELECT pickup.id, pickup.account_id, account.name, pickup.arrival_at, pickup.status, pickup.create_at \
           FROM pickup \
           INNER JOIN account ON account.id=? \
           WHERE account_id=?',
          [id, id]
        )

        return rows
      } catch (err) {
        console.log(err)
        return []
      }
    },

    get_all_pickup: async () => {
      try {
        const [rows] = await mysql.query(
          'SELECT pickup.id, pickup.account_id, account.name, pickup.arrival_at, pickup.status, pickup.create_at FROM pickup INNER JOIN account ON account.id=pickup.account_id'
        )
        return rows
      } catch (err) {
        return []
      }
    },

    create_pickup: async ({ account_id, arrival_at }) => {
      try {
        await mysql.query(
          'INSERT INTO pickup (account_id, arrival_at, status) VALUES (?, ?, ?)',
          [account_id, arrival_at, 0]
        )
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },

    update_pickup: async ({ id, status }) => {
      try {
        const isOk = await get_pickup_by_id(id)
        if (!isOk) {
          return false
        }

        await mysql.query('UPDATE pickup SET status=? WHERE id=?', [status, id])

        return true
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
}

module.exports = pickupRepository
