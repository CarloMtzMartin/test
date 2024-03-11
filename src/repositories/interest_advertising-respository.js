const { fieldToQuery } = require('../helpers/query')
const accountRepository = require('./account-repository')
const advertisingRepository = require('./advertising-repository')

const interestAdvertisingRepository = (fastify) => {
  const tableName = 'interest_advertising'
  const { mysql } = fastify

  const repoAccount = accountRepository(fastify)
  const repoAdvertising = advertisingRepository(fastify)

  const getIds = async () => {
    try {
      const [rows] = await mysql.query(`SELECT id FROM ${tableName}`)
      return rows
    } catch (err) {
      return []
    }
  }

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

  const getInformationById = async (id) => {
    const item = await getById(id)

    const contact = await repoAccount.getById(item.contact_by)
    const account = await repoAccount.getById(item.account_id)
    const advertising = await repoAdvertising.getById(item.advertising_id)

    return {
      ...item,
      contact,
      account: repoAccount.sharedObject(account),
      advertising
    }
  }

  return {
    get_all: async () => {
      const ids = await getIds()

      if (!ids.length) {
        return []
      }

      const results = await Promise.all(
        ids.map(async ({ id }) => {
          const result = await getInformationById(id)
          return result
        })
      )

      return results
    },

    create: async ({ account_id, advertising_id }) => {
      try {
        await mysql.query(
          `INSERT INTO ${tableName} (account_id, advertising_id) VALUES (?, ?)`,
          [account_id, advertising_id]
        )

        return true
      } catch (err) {
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
        await mysql.query(`DELETE FROM ${tableName} WHERE id=?`, [
          id
        ])
        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = interestAdvertisingRepository
