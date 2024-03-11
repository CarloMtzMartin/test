/* eslint-disable space-before-function-paren */
const { fieldToQuery } = require('../helpers/query')

const stayRepository = (fastify) => {
  const tableName = 'stay'
  const { mysql } = fastify

  function getByArgsId(field, limit = 0) {
    return async (id) => {
      try {
        const [rows] = await mysql.query(
          `SELECT * FROM ${tableName} WHERE ${field}=?`,
          [id]
        )

        if (limit > 0) {
          return rows.slice(0, limit)
        }

        return rows
      } catch (err) {
        return []
      }
    }
  }

  const getById = getByArgsId('id', 1)
  const getByAccountId = getByArgsId('account_id')
  const getByOwnershipId = getByArgsId('ownership_id')

  return {
    getById,
    getByAccountId,
    getByOwnershipId,

    getAll: async () => {
      try {
        const [rows] = await mysql.query(`SELECT * FROM ${tableName}`)
        return rows
      } catch (err) {
        return []
      }
    },

    create: async ({ ownership_id, account_id, arrival_at, departure_at }) => {
      try {
        await mysql.query(
          `INSERT INTO ${tableName} (ownership_id, account_id, arrival_at, departure_at) \
                     VALUES (?, ?, ?, ?)`,
          [ownership_id, account_id, arrival_at, departure_at]
        )
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    update: async ({ id, ...fields }) => {
      const isOk = await getById(id)
      if (!isOk) {
        return false
      }

      try {
        const pairs = fieldToQuery(fields)
        const qparams = pairs.params.join(', ')

        await mysql.query(
          `UPDATE ${tableName} SET ${qparams} WHERE id=?`,
          pairs.values.concat([id])
        )

        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    remove: async ({ id }) => {
      const isOk = await getById(id)
      if (!isOk) {
        return false
      }

      try {
        await mysql.query(`DELETE FROM ${tableName} WHERE id=?`, [id])
        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = stayRepository
