'use strict'

var calendars = require('./api')

module.exports = function (app) {
  app.get('/calendars/:id/events', function (req, res) {
    events.list(req.params.id, res.locals.token, res.json)
  })
}
