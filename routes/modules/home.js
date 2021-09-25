const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// route 到首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// sorting routes
router.get('/:sort', (req, res) => {
  const selectedSort = req.params.sort
  const sortObj = {
    'new-old': { _id: 'desc'},
    'rating': { rating: 'desc'},
    'category': { category: 'asc'}
  }
  Restaurant.find()
    .lean()
    .sort(sortObj[selectedSort])
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

module.exports = router
