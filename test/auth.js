'use strict'

var test = require('tape')
var compose = require('../')

test('auth', function (t) {
  var server
  t.test('setup', function (t) {
    compose(function (err, _server_) {
      if (err) return t.end(err)
      server = _server_
      t.end()
    })
  })

  t.test('redirects to google', function (t) {
    t.plan(2)
    server.inject('/authenticate', function (response) {
      t.equal(response.statusCode, 302, 'status code')
      t.ok(/google\.com/.test(response.headers.location), 'location')
    })
  })

  t.test('enforces accessToken in query', function (t) {
    t.plan(2)
    server.route({
      path: '/unauthed',
      method: 'get',
      handler: function (request, reply) {
        reply('Success')
      }
    })
    server.inject('/unauthed', function (response) {
      t.equal(response.statusCode, 401, 'status code')
      t.ok(/Missing accessToken/.test(response.result.message), 'message')
    })
  })

  t.test('exposes access token as "token" credential', function (t) {
    t.plan(2)
    server.route({
      path: '/authed',
      method: 'get',
      handler: function (request, reply) {
        reply(request.auth.credentials.token)
      }
    })
    server.inject('/authed?accessToken=theToken', function (response) {
      t.equal(response.statusCode, 200)
      t.equal(response.result, 'theToken')
    })
  })

  t.test('after', function (t) {
    server.stop(t.end.bind(t))
  })

  t.end()
})
