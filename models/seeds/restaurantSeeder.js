const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')

db.once('open', () => {

  restaurantData.forEach((item) => {
    Restaurant.create({ 
      name: item.name, 
      name_en: item.name_en,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone, 
      google_map: item.google_map, 
      rating: item.rating,
      description: item.description, 
    })
  })

  console.log('Done. Ctrl + C to exit.')
})