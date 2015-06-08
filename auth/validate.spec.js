'use strict'

var test = require('tape')
var express = require('express')
var got = require('got')
var validate = require('./validate')

test('access token query validator', function (t) {
  var app = express()
  app.use(validate)

  var server = app.listen(9999, function (err) {
    if (err) return t.end(err)

    t.test('present', function (t) {
      t.plan(1)
      app.get('/', function (req, res) {
        t.equal(res.locals.token, 'theToken')
        res.end()
      })
      got('http://localhost:9999?accessToken=theToken', t.end)
    })

    t.test('missing', function (t) {
      t.plan(2)
      got('http://localhost:9999', {json: true}, function (err, data, response) {
        t.equal(response.statusCode, 401, '401')
        t.deepEqual(data, {
          error: 'accessToken param missing'
        })
      })
    })

    t.test(function (t) {
      server.close(t.end)
    })
  })
})
