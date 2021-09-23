// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

require('./config/mongoose')
const routes = require('./routes')
const app = express()

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// setting mehtod-override
app.use(methodOverride('_method'))

// routes setting
app.use(routes)

// start and listen on the Express server
app.listen(3000, () => {
  console.log('Express is listening on localhost: 3000.')
})
