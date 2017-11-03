require('dotenv').config()
const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const { anuncios, auth } = require('./routes/apiv1')

const jwtAuth = require('./lib/jwtAuth')

const CustomError = require('./lib/custom_error')

const i18n = require('./lib/config-i18n')()

const app = express()

const isApi = req => req.originalUrl.indexOf('/api') === 0

// DB connection
require('./lib/connect_db')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.LOG_FORMAT !== 'nolog') {
  app.use(logger('dev'))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(i18n.init)

app.use('/', index)
app.use('/apiv1/anuncios', jwtAuth(), anuncios)
app.use('/apiv1/authenticate', auth)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  const myError = CustomError(err, req.query.lang || 'en')
  // set locals, only providing error in development
  res.locals.message = myError.message
  res.locals.error = req.app.get('env') === 'development' ? myError : {}

  // render the error page
  res.status(err.code || 500)
  if (isApi(req)) {
    res.json({ error: myError.message })
    return
  }
  res.render('error')
})

module.exports = app
