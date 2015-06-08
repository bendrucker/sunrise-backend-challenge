'use strict'

var calendars = require('./api')

module.exports = function (app) {
  app.get('/calendars/:id', function (req, res) {
    calendars.list(res.locals.token, res.json)
  })
}
