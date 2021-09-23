const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// routes setting 
//route 到新增頁
router.get('/new', (req, res) => {
  res.render('new')
})

//route 新增餐廳存檔後回首頁
router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
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

// sorting routes
router.get('/new-old', (req, res) => {
  Restaurant.find()
  .lean()
  .sort({ _id: 'desc' })
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

router.get('/rating', (req, res) => {
  Restaurant.find()
  .lean()
  .sort({ rating: 'desc' })
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

router.get('/category', (req, res) => {
  Restaurant.find()
  .lean()
  .sort({ category: 'asc' })
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

//route 編輯某餐廳頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then((restaurant) => {
      for (const [key, value] of Object.entries(req.body)) {
        restaurant[key] = value
      }
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//route 查看某餐廳頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
   .lean()
   .then(restaurant => res.render('show', { restaurant }))
   .catch(error => console.log(error))
})

//route 刪除某餐廳後重新渲染首頁
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router