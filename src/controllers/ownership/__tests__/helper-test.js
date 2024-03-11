const { bookingsByYear } = require('../helper')

describe('Query para obtener informacion total al año de una propiedad', () => {
  it('Happy path', async () => {
    const result = await bookingsByYear({
      year: 2021,
      cache: {
        get: jest.fn().mockResolvedValue([]),
        append: jest.fn().mockResolvedValue(null)
      },
      request: jest.fn().mockResolvedValue({
        page_count: 1,
        bookings: []
      })
    })
    expect(result).toBeInstanceOf(Array)
    expect(result).toEqual([])
  })
})
