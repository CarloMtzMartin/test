const categoryRepository = (fastify) => {
  const tableName = 'category'
  const { mysql } = fastify

  return {
    getAll: async () => {
      try {
        const [rows] = await mysql.query(
          `SELECT * FROM ${tableName}`
        )
        return rows
      } catch (err) {
        return []
      }
    },

    create: async ({ category }) => {
      try {
        await mysql.query(
          `INSERT INTO ${tableName}\
                (category) VALUES (?)`,
          [category]
        )
        return true
      } catch (err) {
        return false
      }
    }
  }
}

module.exports = categoryRepository
