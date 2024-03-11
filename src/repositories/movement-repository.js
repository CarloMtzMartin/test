const { fieldToQuery } = require('../helpers/query')

const movementRepository = (fastify) => {
  const tableName = 'movement'
  const { mysql } = fastify

  const getById = async (id) => {
    try {
      const [rows] = await mysql.query(
        `SELECT * FROM ${tableName} WHERE id=?`,
        [id]
      )
      return rows[0] ?? null
    } catch (err) {
      return null
    }
  }

  const getByOwnershipId = async (id) => {
    try {
      const [rows] = await mysql.query(
        `SELECT * FROM ${tableName} WHERE ownership_id=?`,
        [id]
      )

      return rows
    } catch (err) {
      return []
    }
  }

  const getByOptReservationId = async ({ id }) => {
    try {
      const [rows] = await mysql.query(
        `SELECT * FROM ${tableName} WHERE opt_reservation_id=?`,
        [id]
      )

      return rows[0] ?? null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  const getByMonth = async ({ month, year }) => {
    try {
      const [rows] = await mysql.query(
        `SELECT * \
           FROM ${tableName} \
           WHERE MONTH(create_at)=? \
           AND YEAR(create_at)=?`,
        [month, year]
      )

      return rows
    } catch (err) {
      return []
    }
  }

  const getMonthByOwnerships = async ({ month, year, ownerships }) => {
    try {
      const query = `SELECT * \
           FROM ${tableName} \
      WHERE MONTH(create_at)=? AND YEAR(create_at)=? AND ownership_id IN (${ownerships.join(
        ', '
      )})`

      const [rows] = await mysql.query(query, [month, year])

      return rows
    } catch (err) {
      return []
    }
  }

  const create = async ({
    concept,
    category,
    description,
    photo,
    author,
    type,
    amount,
    current_money,
    ownership_id,
    opt_reservation_id,
    create_at
  }) => {
    try {
      const [result] = await mysql.query(
        `INSERT INTO ${tableName}\
           (concept, category, description, photo, author, type, amount, current_money, ownership_id, opt_reservation_id, create_at)\
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          concept,
          category,
          description,
          photo ?? '',
          author,
          type,
          amount,
          current_money,
          ownership_id,
          opt_reservation_id,
          create_at
        ]
      )

      const { insertId } = result

      return insertId
    } catch (err) {
      console.log(err)
      return false
    }
  }

  return {
    getById,
    getByOwnershipId,
    getByMonth,
    getMonthByOwnerships,

    create,

    update: async ({ id, ...fields }) => {
      try {
        const isOk = await getById(id)
        if (!isOk) {
          return false
        }

        const pairs = fieldToQuery(fields)
        const qparams = pairs.params.join(', ')

        // console.log('Params', { qparams, pairs })

        const query = `UPDATE ${tableName} SET ` + qparams + ' WHERE id=?'

        await mysql.query(query, pairs.values.concat([id]))

        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    remove: async ({ id }) => {
      try {
        const isOk = await getById(id)
        if (!isOk) {
          return false
        }

        await mysql.query(`DELETE FROM ${tableName} WHERE id=?`, [id])

        return true
      } catch (err) {
        return false
      }
    },

    create_verified: async ({
      concept,
      category,
      description,
      photo,
      author,
      type,
      amount,
      current_money,
      ownership_id,
      opt_reservation_id,
      create_at
    }) => {
      try {
        const exists = await getByOptReservationId({ id: opt_reservation_id })
        if (exists) {
          return null
        }

        const form = {
          concept,
          category,
          description,
          photo,
          author,
          type,
          amount,
          current_money,
          ownership_id,
          opt_reservation_id,
          create_at
        }

        const id = await create(form)
        return id
      } catch (err) {
        console.log(err)
        return false
      }
    }
  }
}

module.exports = movementRepository
