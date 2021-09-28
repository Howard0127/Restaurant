const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  Restaurant.insertMany(restaurantData)
  console.log('Done. Ctrl + C to exit.')
})
