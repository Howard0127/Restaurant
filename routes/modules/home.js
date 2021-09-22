const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// route 到首頁
router.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

//route 到搜尋結果頁面
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const keywordArr = keyword.toLowerCase().split(' ')
  
  Restaurant.find()
    .lean()
    .then(restaurants => {
      let filteredRestaurant = []
      for (restaurant of restaurants) {
        const name = restaurant.name.toLowerCase()
        const category = restaurant.category.toLowerCase()
        const location = restaurant.location.toLowerCase()
        if (keywordArr.find((word) => 
          name.includes(word) || category.includes(word) || location.includes(word)
        )) {
          filteredRestaurant.push(restaurant)
        }         
      }

      res.render('index', { restaurants: filteredRestaurant, keyword })
    })
    .catch(error => console.log(error))
})

module.exports = router