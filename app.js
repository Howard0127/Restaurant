// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')

// setting mongodb connection
mongoose.connect('mongodb://localhost/restaurant-list')

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// require express-handlebars here
const exphbs = require('express-handlebars')

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// routes setting
// route 到首頁
app.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

//route 到新增頁
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//route 新增餐廳存檔後回首頁
app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//route 編輯某餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
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
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
   .lean()
   .then(restaurant => res.render('show', { restaurant }))
   .catch(error => console.log(error))
})

//route 刪除某餐廳後重新渲染首頁
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//route 到搜尋結果頁面
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const keywordArr = keyword.toLowerCase().split(' ')
  
  Restaurant.find()
    .lean()
    .then(restaurants => {
      let filteredRestaurant = []
      for (restaurant of restaurants) {
        const name = restaurant.name.toLowerCase()
        const category = restaurant.category.toLowerCase()
        if (keywordArr.find((word) => 
          name.includes(word) || category.includes(word)
        )) {
          filteredRestaurant.push(restaurant)
        }         
      }

      res.render('index', { restaurants: filteredRestaurant, keyword })
    })
    .catch(error => console.log(error))
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost: ${port}`)
})
