const { fieldToQuery } = require('../helpers/query')

const advertisingRepository = (fastify) => {
  const { mysql } = fastify

  const getById = async (id) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM advertising WHERE id=?', [
        id
      ])
      return rows[0] ?? null
    } catch (err) {
      return null
    }
  }

  return {
    getById,

    get_all: async () => {
      try {
        const [rows] = await mysql.query('SELECT * FROM advertising')
        return rows
      } catch (err) {
        return []
      }
    },

    create: async ({ name, photo }) => {
      try {
        const [result] = await mysql.query(
          'INSERT INTO advertising (name, photo, mount) VALUES (?, ?, ?)',
          [name, photo, 1]
        )

        const { insertId } = result

        return insertId
      } catch (err) {
        return false
      }
    },

    update: async ({ id, ...fields }) => {
      try {
        const isOk = await getById(id)
        if (!isOk) {
          return false
        }

        const pairs = fieldToQuery(fields)
        const qparams = pairs.params.join(', ')

        const query = 'UPDATE advertising SET ' + qparams + ' WHERE id=?'

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

        await mysql.query('DELETE FROM advertising WHERE id=?', [id])

        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = advertisingRepository
