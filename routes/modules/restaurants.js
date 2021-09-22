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