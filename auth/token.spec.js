'use strict'

var test = require('tape')
var nock = require('nock')
var qs = require('qs')
var token = require('./token')
var apiClient = require('../client')

test('getting token', function (t) {
  t.plan(3)
  var api = nock(apiClient.api.protocol + '://' + apiClient.api.host)

  var google = {
    clientId: 'theClientId',
    clientSecret: 'theClientSecret'
  }
  var response = {
    access_token: 'theAccess',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'theRefresh'
  }

  api
    .post(token.url.pathname, function (body) {
      t.deepEqual(qs.parse(body), {
        code: 'theAuth',
        client_id: 'theClientId',
        client_secret: 'theClientSecret',
        grant_type: 'authorization_code',
        redirect_uri: 'theCb'
      })
      return true
    })
    .matchHeader('content-type', function (type) {
      t.equal(type, 'application/x-www-form-urlencoded', 'form enc')
      return true
    })
    .reply(200, JSON.stringify(response))

  var options = {
    auth: 'theAuth',
    client: google,
    callbackUrl: 'theCb'
  }
  token.get(options, function (err, auth) {
    if (err) return t.end(err)
    t.deepEqual(auth, response)
  })
})
