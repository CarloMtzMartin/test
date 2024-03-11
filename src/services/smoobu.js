/* eslint-disable no-trailing-spaces */
const axios = require('axios')
const { arrayToQueryParams, objectToQueryParams } = require('../helpers/query')

const apiCreator = ({ apikey }) => {
  const api = axios.create({
    baseURL: 'https://login.smoobu.com/',
    timeout: 10000,
    headers: {
      'Api-Key': apikey,
      'cache-control': 'no-cache'
    }
  })

  return {
    /*
      {
          "id": 7,
          "firstName": "John",
          "lastName": "Doe",
          "email": "jhon@example.com"
      }
      */
    getUser: async () => {
      try {
        const result = await api.get('/api/me')
        console.log(result.data)
        return result.data
      } catch (err) {
        console.log(err)
      }
    },

    // Apartment
    /*
    {
        GET APARTMENTS
        "apartments": [
            {
                "id": 1,
                "name": "Property 1"
            },
            {
                "id": 2,
                "name": "Property 2"
            }
        ]
    }
    */
    getApartments: async () => {
      try {
        const result = await api.get('/api/apartments')
        console.log(result.data)
        return result.data
      } catch (err) {
        console.log(err)
        return null
      }
    },

    /*
   {
    GET APARTMENNT
    "location": {
        "street": "Wönnichstr. 68/70",
        "zip": "10317",
        "city": "Berlin",
        "country": "Germany",
        "latitude": "52.5200080000000",
        "longitude": "13.4049540000000"
    },
   "timeZone": "Europe/Berlin",
    "rooms": {
        "maxOccupancy": 4,
        "bedrooms": 4,
        "bathrooms": 2,
        "doubleBeds": 1,
        "singleBeds": 3,
        "sofaBeds": null,
        "couches": null,
        "childBeds": null,
        "queenSizeBeds": null,
        "kingSizeBeds": 1

    },
    "equipments": [
        "Internet",
        "Whirlpool",
        "Pool",
        "Heating"
    ],
    "currency": "EUR",
    "price": {
            "minimal": "10.00",
            "maximal": "100.00"
    },
    "type": {
        "id": 2,
        "name": "Holiday rental"
    }
} 
    */
    getApartment: async ({ id }) => {
      try {
        const result = await api.get(`/api/apartments/${id}`)
        console.log(result.data)
      } catch (err) {
        console.log(err)
      }
    },

    /*
    BODY: 
    {
        "arrivalDate" : "2017-11-01",
        "departureDate":  "2017-12-03",
        "apartments": [2, 3, 14],
        "customerId": 9
    }

    RESPONSE:
    {
        "availableApartments": [
            2,
            3,
            14

        ],
        "prices": {
            "3": {
                "price": 36560,
                "currency": "IDR"
            },
            "14": {
                "price": 4415,
                "currency": "IDR"
            }
        },
        "errorMessages": {
            "2": {
                "errorCode": 401,
                "message": "The duration of the booking is too short.",
                "minimumLengthOfStay": 50
            }
        }
    }
    */

    getApartmentAvailability: async ({
      arrivalDate,
      departureDate,
      apartments,
      customerId
    }) => {
      try {
        console.log({
          arrivalDate,
          departureDate,
          apartments,
          customerId
        })
        const result = await api.post('/booking/checkApartmentAvailability', {
          arrivalDate,
          departureDate,
          apartments,
          customerId
        })

        return result.data
      } catch (err) {
        console.log(err.message)
      }
    },

    /*
     PARAMS:
     apartments [],
     start_date 2019-01-15
     end_date 2019-01-30

     RESPONSE:

     {
      "data": {
          "398": {
              "2019-01-15": {
                  "price": 444,
                  "min_length_of_stay": 2,
                  "available": 1
              },
              "2019-01-30": {
                  "price": null,
                  "min_length_of_stay": null,
                  "available": 1
              }
          },
          "401": {
              "2019-01-15": {
                  "price": 170,
                  "min_length_of_stay": null,
                  "available": 1
              },
              "2019-01-30": {
                  "price": null,
                  "min_length_of_stay": null,
                  "available": 1
              }
          }
      }
  }
     */

    getRates: async ({ apartments, start_date, end_date }) => {
      try {
        const apartmentsParams = arrayToQueryParams('apartments', apartments)

        const result = await api.get(
          `/api/rates?${apartmentsParams}&start_date=${start_date}&end_date=${end_date}`
        )

        return result.data
      } catch (err) {
        console.log(err.message)
      }
    },

    getReservations: async ({ from, to, page }) => {
      try {
        const queryParam = objectToQueryParams({ from, to, page })
        const result = await api.get(`/api/reservations?showCancellation=false&${queryParam}`)
        return result.data
      } catch (err) {
        console.log(err.message)
        return null
      }
    },

    genericRequest: async (query) => {
      try {
        const result = await api.get(`${query}`)
        return result.data
      } catch (err) {
        console.log(err.message)
        return null
      }
    }
  }
}

module.exports = apiCreator
