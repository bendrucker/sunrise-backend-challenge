'use strict'

var calendars = require('./api')

module.exports = function (app) {
  app.get('/calendars/:id/events', function (req, res) {
    events.list(req.params.id, res.locals.token, function (err, events) {
      if (err) {
        res.status(500).json({
          error: 'Could not fetch events'
        }) 
      } else {
        res.json(events)
      }
    })
  })

  return app
}
