const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const User = require('../user')
const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')

const SEED_USERS = [
  {
    name: 'SEED_USER_1',
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    name: 'SEED_USER_2',
    email: 'user2@example.com',
    password: '12345678',
  },
]

db.once('open', () => {
  for (let j = 0; j < SEED_USERS.length; j++) {
    const { name, email, password } = SEED_USERS[j]
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then((user) => {
        return Promise.all(
          Array.from({ length: 3 }, (_, i) => {
            restaurantData[i + j * 3].userId = user._id
            return Restaurant.create(restaurantData[i + j * 3])
          })
        )
      })
      .then(() => {
        console.log(`done with SEED_USER_${j + 1}`)
        //為什麼這邊用process.exit()會只有五筆餐廳資料
      })
  }
})
