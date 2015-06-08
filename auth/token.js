'use strict'

var got = require('got')
var qs = require('qs')
var url = require('url')
var api = require('../client').api

var tokenApi = exports.url = {
  protocol: api.protocol,
  host: api.host,
  pathname: '/oauth2/v3/token'
}

var tokenUrl = url.format(tokenApi)

exports.get = function (options, callback) {
  var headers = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  var body = qs.stringify({
    code: options.auth,
    client_id: options.client.clientId,
    client_secret: options.client.clientSecret,
    redirect_uri: options.callbackUrl,
    grant_type: 'authorization_code'
  })
  got.post(tokenUrl, {headers: headers, body: body, json: true}, callback)
}
