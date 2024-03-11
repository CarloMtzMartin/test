const bookingsByYear = async ({ year, cache, request }) => {
  const [from, to] = [`${year}-01-01`, `${year}-12-31`]
  const page = 1

  let firstCall = await cache.get(`${from}-${to}-${page}`)

  if (!firstCall) {
    const subkey = `${from}-${to}-${page}`
    firstCall = await request({ from, to, page })
    await cache.append(subkey, firstCall)
  }

  let bookings = [].concat(firstCall.bookings)

  const page_count = firstCall?.page_count

  for (let i = 2; i <= page_count; i++) {
    const subkey = `${from}-${to}-${i}`
    let result = await cache.get(subkey)

    if (!result) {
      result = await request({
        from,
        to,
        page: i
      })
      await cache.append(subkey, result)
    }

    bookings = bookings.concat(result.bookings)
  }

  return bookings
}

module.exports = {
  bookingsByYear
}
