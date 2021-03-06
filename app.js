// require packages used in the project
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
require('./config/mongoose')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// setting static files
app.use(express.static('public'))

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// setting mehtod-override
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app
usePassport(app)

// 掛載flash
app.use(flash())

// 設定本地變數
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// routes setting
app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`Express is listening on localhost: ${PORT}.`)
})
