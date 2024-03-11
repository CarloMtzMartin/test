const { objectToQueryParams } = require('../query')

describe('objectToQueryParams', () => {
  it('happy path', () => {
    expect(
      objectToQueryParams({
        hola: 'william',
        mundo: 'william'
      })
    ).toEqual('hola=william&mundo=william')
  })

  it('property undefined must be omitte', () => {
    expect(
      objectToQueryParams({
        hola: 'william',
        mundo: undefined
      })
    ).toEqual('hola=william')
  })
})
