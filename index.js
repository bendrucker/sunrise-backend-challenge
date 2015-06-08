'use strict'

var express = require('express')
var auth = require('./auth')
var calendar = require('./calendar')
var event = require('./event')

auth.routes.locals.google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}

module.exports = express()
  .use('/authenticate', auth.routes)
  .use(auth)
  .use(calendar)
  .use(event)
