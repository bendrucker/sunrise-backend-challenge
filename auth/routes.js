'use strict'

var qs = require('qs')
var url = require('url')
var path = require('path')
var token = require('./token')

module.exports = function (app) {
  app.get('/', function (req, res) {
    var callbackUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: path.join(app.mountpath, req.path, 'callback')
    })
    res.redirect('https://accounts.google.com/o/oauth2/auth?' + qs.stringify({
      redirect_uri: callbackUrl,
      response_type: 'code',
      client_id: app.locals.google.clientId,
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    }))
  })

  app.get('/callback', function (req, res) {
    var code = req.query.code
    token.get(code, app.locals.google, function (err, auth, response) {
      if (err) {
        res.status(response.statusCode).json({
          error: err.message
        })
      } else {
        res.json(auth)
      }
    })
  })

  return app
}
