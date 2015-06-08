'use strict'

var test = require('tape')
var url = require('url')
var express = require('express')
var shot = require('shot')
var http = require('http')
var url = require('url')
var readAllStream = require('read-all-stream')
var proxyquire = require('proxyquire')
var token = {}

var routes = proxyquire('./routes', {
  './token': token
})

test('auth routes', function (t) {
  var app = express()
  var auth = express()
  auth.locals = {
    google: {
      clientId: 'theClientId',
      clientSecret: 'theClientSecret'
    }
  }
  routes(auth)
  app.use('/authenticate', auth)

  var server = app.listen(9999, function (err) {
    if (err) return t.end(err)

    t.test('redirect', function (t) {
      t.plan(3)
      http.get('http://localhost:9999/authenticate', function (response) {
        t.equal(response.statusCode, 302)
        t.ok(response.headers.location)
        var query = url.parse(response.headers.location, true).query
        t.deepEqual(query, {
          client_id: 'theClientId',
          redirect_uri: 'http://localhost:9999/authenticate/callback',
          response_type: 'code',
          scope: 'https://www.googleapis.com/auth/calendar.readonly'
        })
      })
      .on('error', t.end)
    })

    t.test('callback', function (t) {
      t.plan(5)
      // mock token.get
      token.get = function (options, callback) {
        t.equal(options.auth, 'theCode', 'auth code')
        t.deepEqual(options.client, auth.locals.google, 'receives client')
        t.ok(options.callbackUrl, 'includes callback url')
        callback(null, {access_token: 'at'}, {statusCode: 200})
      }
      http.get('http://localhost:9999/authenticate/callback?code=theCode', function (response) {
        t.equal(response.statusCode, 200, '200')
        readAllStream(response, function (err, data) {
          if (err) return t.end(err)
          data = JSON.parse(data)
          t.deepEqual(data, {access_token: 'at'})
        })
      })
    })

    t.test('callback - err', function (t) {
      t.plan(2)
      // mock token.get to fail
      token.get = function (options, callback) {
        callback(new Error('broken'), {}, {statusCode: 401})
      }
      http.get('http://localhost:9999/authenticate/callback', function (response) {
        t.equal(response.statusCode, 401, 'copies google err code')
        readAllStream(response, function (err, data) {
          if (err) return t.end(err)
          data = JSON.parse(data)
          t.deepEqual(data, {error: 'broken'})
        })
      })
    })

    t.test(function (t) {
      server.close(t.end)
    })
  })
})
