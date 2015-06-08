'use strict'

var qs = require('qs')
var url = require('url')
var path = require('path')
var token = require('./token')

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('https://accounts.google.com/o/oauth2/auth?' + qs.stringify({
      redirect_uri: callbackUrl(req),
      response_type: 'code',
      client_id: app.locals.google.clientId,
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    }))
  })

  app.get('/callback', function (req, res) {
    var options = {
      auth: req.query.code,
      client: app.locals.google,
      callbackUrl: callbackUrl(req)
    }
    token.get(options, function (err, auth, response) {
      if (err) {
        console.error(err)
        res.status(response.statusCode).json({
          error: err.message
        })
      } else {
        res.json(auth)
      }
    })
  })

  function callbackUrl (req) {
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: path.join(app.mountpath, 'callback')
    })
  }

  return app
}
