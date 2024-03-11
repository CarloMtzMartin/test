const { getMonth, getDaysOfMonth } = require('../datelib')

describe('Datelib', () => {
  it('getMonth', () => {
    const month = getMonth('2022-10-02 23:23:37')
    const month1 = getMonth('2022-01-02')
    const monthX = getMonth('')
    const monthY = getMonth('20-10-02')
    expect(month).toBe(10)
    expect(month1).toBe(1)
    expect(monthX).toBe(1)
    expect(monthY).toBe(1)
  })

  it('getDaysOfManth', () => {
    expect(getDaysOfMonth({ year: 2022, month: 11 })).toBe(30)
  })
})
