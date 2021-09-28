const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// routes setting
// route 到新增頁
router.get('/new', (req, res) => {
  res.render('new')
})

// route 新增餐廳存檔後回首頁
router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// route 到搜尋結果頁面
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const keywords = keyword.toLowerCase().split(' ')
  
  if (keyword.length === 0) {
    res.redirect('/')
  }

  const keywordsRegExp = new RegExp(keywords.join("|"), 'gi')
  Restaurant.find({$or: [
    {name: {$in: keywordsRegExp}}, 
    {location: {$in: keywordsRegExp}}, 
    {category: {$in: keywordsRegExp}}
    ]})
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})

// route 編輯某餐廳頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByIdAndUpdate(id, {$set: req.body})

    // .then((restaurant) => {
    //   for (const [key, value] of Object.entries(req.body)) {
    //     restaurant[key] = value
    //   }
    //   return restaurant.save()
    // })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// route 查看某餐廳頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// route 刪除某餐廳後重新渲染首頁
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
