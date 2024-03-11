const fieldToQuery = (fields) => {
  const pairs = Object.entries(fields).reduce(
    (acc, [key, val]) => {
      const param = `${key}=?`
      acc.params.push(param)
      acc.values.push(`${val}`)
      return acc
    },
    {
      params: [],
      values: []
    }
  )

  return pairs
}

const arrayToQueryParams = (paramName, array) => {
  const str = array.map((item) => `${paramName}[]=${item}`).join('&')
  return str
}

const objectToQueryParams = (obj) => {
  const queryParams = Object.entries(obj).reduce((acc, el) => {
    if (!el[1]) {
      return acc
    }

    acc.push(`${el[0]}=${el[1]}`)
    return acc
  }, [])

  return queryParams.join('&')
}

module.exports = {
  fieldToQuery,
  arrayToQueryParams,
  objectToQueryParams
}
