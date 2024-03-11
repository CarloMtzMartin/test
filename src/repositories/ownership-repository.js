const { fieldToQuery } = require('../helpers/query')

const ownershipRepository = (fastify) => {
  const { mysql } = fastify

  const get_ownership_by_id = async (id) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM ownership WHERE id=?', [
        id
      ])

      return rows.length ? rows[0] : null
    } catch (err) {
      return null
    }
  }

  const getByPropertyId = async (id) => {
    try {
      const [rows] = await mysql.query(
        'SELECT * FROM ownership WHERE property_id=?',
        [id]
      )

      return rows.length ? rows[0] : null
    } catch (err) {
      return null
    }
  }

  return {
    getById: get_ownership_by_id,
    getByPropertyId,

    getByAccountId: async (id) => {
      try {
        const [rows] = await mysql.query(
          'SELECT * FROM ownership WHERE owner_id=?',
          [id]
        )

        return rows
      } catch (err) {
        return []
      }
    },

    get_all_ownership: async () => {
      try {
        const [rows] = await mysql.query(
          'SELECT ownership.id,\
          ownership.name,\
          ownership.location,\
          ownership.description,\
          ownership.photo,\
          ownership.property_id,\
          account.name AS owner_name,\
          account.id AS owner_id \
          FROM ownership INNER JOIN account ON account.id=ownership.owner_id'
        )
        return rows
      } catch (err) {
        return []
      }
    },

    get_ownerships_by_owner_id: async ({ owner_id }) => {
      try {
        const [rows] = await mysql.query(
          'SELECT * FROM ownership WHERE owner_id=?',
          [owner_id]
        )
        return rows
      } catch (err) {
        return []
      }
    },

    create_ownership: async ({
      name,
      location,
      description,
      photo,
      owner_id,
      property_id
    }) => {
      try {
        const [result] = await mysql.query(
          'INSERT INTO ownership (name, location, description, photo, owner_id, property_id) \
          VALUES (?, ?, ? ,? ,?, ?)\
          ',
          [name, location, description, photo, owner_id, property_id]
        )

        const { insertId } = result

        return insertId
      } catch (err) {
        return false
      }
    },

    update_ownership: async ({ id, ...fields }) => {
      try {
        const isOk = await get_ownership_by_id(id)
        if (!isOk) {
          return false
        }

        const pairs = fieldToQuery(fields)

        const query =
          'UPDATE ownership SET ' + pairs.params.join(', ') + ' WHERE id=?'

        await mysql.query(query, pairs.values.concat([id]))

        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    delete_ownership: async ({ id }) => {
      try {
        const isOk = await get_ownership_by_id(id)
        if (!isOk) {
          return false
        }

        await mysql.query('DELETE FROM ownership WHERE id=?', [id])

        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = ownershipRepository
