const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const compression = require('compression')
const helmet = require('helmet')

require('dotenv').config()
const PORT = process.env.PORT || 3000

const app = express()

// routes
const indexRouter = require('./routes/indexRouter')
const chatRouter = require('./routes/chatRouter')

// mongo connect
mongoose.connect(process.env.MONDO_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .then(app.listen(PORT))
    .catch(err => console.log(err))

app.use(compression())
app.use(helmet())
app.use(logger('dev'))
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// using parsers
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookie())

// using routers
app.use('', indexRouter)
app.use('/chat', chatRouter)



