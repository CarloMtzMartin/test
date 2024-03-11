const { fullDatetimeNow } = require('../helpers/datelib')
const { fieldToQuery } = require('../helpers/query')

const walletRepository = (fastify) => {
  const tableName = 'wallet'
  const { mysql } = fastify

  const getById = async (id) => {
    try {
      const [rows] = await mysql.query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
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
        `SELECT * FROM ${tableName} WHERE ownership_id = ?`,
        [id]
      )

      return rows[0] ?? null
    } catch (err) {
      return null
    }
  }

  return {
    getById,
    getByOwnershipId,

    create: async ({ ownership_id, account_id, amount, usd_amount }) => {
      try {
        const exists = await getByOwnershipId(ownership_id)
        if (exists) {
          return false
        }

        const [result] = await mysql.query(
          `INSERT INTO ${tableName} (ownership_id, account_id, amount, usd_amount, update_at) VALUES (?, ?, ?, ?, ?)`,
          [ownership_id, account_id, amount, usd_amount, fullDatetimeNow()]
        )

        const { insertId } = result

        return insertId
      } catch (err) {
        console.log('Exception create', err)
        return null
      }
    },

    update: async ({ id, ...fields }) => {
      console.log(id, fields)
      try {
        const isOk = await getById(id)
        if (!isOk) {
          console.log('Update No exisite')
          return false
        }

        // const queryUSD = `ALTER TABLE ${tableName} ADD usd_amount DECIMAL(10,2);`
        // await mysql.query(queryUSD)

        const pairs = fieldToQuery(fields)

        const query =
          'UPDATE ' +
          tableName +
          ' SET ' +
          pairs.params.join(', ') +
          ' WHERE id=?'

        await mysql.query(query, pairs.values.concat([id]))

        return true
      } catch (err) {
        console.log('Exceptions', err)
        return false
      }
    }
  }
}

module.exports = walletRepository
