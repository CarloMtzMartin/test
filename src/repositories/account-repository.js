const { fieldToQuery } = require('../helpers/query')
const ownershipRepository = require('../repositories/ownership-repository')

const accountRepository = (fastify) => {
  const { mysql } = fastify
  const repoOwnership = ownershipRepository(fastify)

  const getAccountById = async (id) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM account WHERE id=?', [id])
      return rows.length ? rows[0] : null
    } catch (err) {
      return null
    }
  }

  const getAccountsId = async () => {
    try {
      const [rows] = await mysql.query('SELECT id FROM account')
      return rows
    } catch (err) {
      return []
    }
  }

  const getByEmail = async (email) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM account WHERE email=?', [
        email
      ])
      return rows[0] ?? null
    } catch (err) {
      return null
    }
  }

  const getAccountInformationById = async ({ id }) => {
    try {
      const accountInfo = await getAccountById(id)
      if (!accountInfo) {
        return null
      }

      const ownerships = await repoOwnership.get_ownerships_by_owner_id({
        owner_id: id
      })

      const account = sharedObject(accountInfo)

      return {
        ...account,
        ownerships
      }
    } catch (err) {
      return null
    }
  }

  const sharedObject = (account) => {
    return {
      id: account?.id ?? -1,
      name: account?.name ?? '',
      email: account?.email ?? '',
      role: account?.role ?? '',
      status: account?.status ?? '',
      location: account?.location ?? '',
      phone: account?.phone ?? '',
      photo: account?.photo ?? '',
      subcribe_at: account?.subcribe_at ?? '',
      create_at: account?.create_at ?? ''
    }
  }

  const isValidEmailForChange = async ({ email }) => {
    try {
      const [rows] = await mysql.query('SELECT * FROM account WHERE email=?', [
        email
      ])
      return !!rows.length
    } catch (err) {
      return false
    }
  }

  return {
    sharedObject,

    getById: getAccountById,
    getByEmail,

    getAccountById,
    getAccountsId,
    getAccountInformationById,

    getAccountStatus: async () => {
      try {
        const [rows] = await mysql.query('SELECT id, status, role FROM account')
        return rows
      } catch (err) {
        return []
      }
    },

    get_all_account: async () => {
      try {
        const accountIds = await getAccountsId()
        if (!accountIds.length) {
          return []
        }

        const results = await Promise.all(
          accountIds.map(async ({ id }) => {
            const result = await getAccountInformationById({ id })
            return result
          })
        )

        return results
      } catch (err) {
        return []
      }
    },

    get_account_by_signing: async ({ email, password }) => {
      try {
        const [rows] = await mysql.query(
          'SELECT * FROM account WHERE email=? AND password=?',
          [email, password]
        )

        return rows.length ? rows[0] : null
      } catch (err) {
        return null
      }
    },

    create_account: async ({
      name,
      email,
      role,
      password,
      phone,
      location,
      subcribe_at
    }) => {
      try {
        const isExists = await getByEmail(email)
        if (isExists) {
          return false
        }

        await mysql.query(
          'INSERT INTO account (name, email, status, role, phone, location, subcribe_at, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [name, email, 0, role, phone, location, subcribe_at, password]
        )

        return true
      } catch (err) {
        return false
      }
    },

    update_account: async ({ id, ...fields }) => {
      try {
        const isOk = await getAccountById(id)
        if (!isOk) {
          return false
        }

        if (Object.keys(fields).some((field) => field === 'email')) {
          const isExist = await isValidEmailForChange(fields)
          if (isExist) {
            return false
          }
        }

        const pairs = fieldToQuery(fields)

        const query =
          'UPDATE account SET ' + pairs.params.join(', ') + ' WHERE id=?'

        await mysql.query(query, pairs.values.concat([id]))

        return true
      } catch (err) {
        return false
      }
    },

    delete_account: async ({ id }) => {
      try {
        const isOk = await getAccountById(id)
        if (!isOk) {
          return false
        }

        await mysql.query('DELETE FROM account WHERE id=?', [id])

        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = accountRepository
