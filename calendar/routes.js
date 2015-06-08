'use strict'

var calendars = require('./api')

module.exports = function (app) {
  app.get('/calendars', function (req, res) {
    calendars.list(res.locals.token, function (err, calendars) {
      if (err) {
        console.error(err)
        res.status(500).json({
          error: 'Could not fetch calendars'
        }) 
      } else {
        res.json(calendars)
      }
    })
  })

  return app
}
