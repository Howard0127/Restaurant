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
app.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurantList.results.find(
    (item) => item.id.toString() === id
  )
  res.render('show', { restaurant })
})

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
