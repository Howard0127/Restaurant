const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const User = require('../user')
const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')


const SEED_USERS = [{
  email: 'user1@example.com',
  password: '12345678',
  res_index: [0, 1, 2]
},
{
  email: 'user2@example.com',
  password: '12345678',
  res_index: [3, 4, 5]
}]

db.once('open', () => {
  Promise.all(Array.from(SEED_USERS,  seedUser => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({ email: seedUser.email, password: hash }))
      .then(user => {
        const userId = user._id
        const restaurants = Array.from(seedUser.res_index, i => restaurantData[i])
        restaurants.forEach(restaurant => restaurant.userId = userId)
        console.log(restaurants)
        return Restaurant.create(restaurants)
      })
  }))
    .then(() => {
      console.log('Done!')
      process.exit()
    })
    .catch(err => console.log(err))
})