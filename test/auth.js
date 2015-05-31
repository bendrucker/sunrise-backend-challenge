'use strict'

var expect = require('code').expect
var Lab = require('lab')
var lab = exports.lab = Lab.script()
var compose = require('../')

lab.experiment('auth', function () {
  var server
  lab.before(function (done) {
    compose(function (err, _server_) {
      if (err) return done(err)
      server = _server_
      done()
    })
  })

  lab.test('redirects to google', function (done) {
    server.inject('/authenticate', function (response) {
      expect(response.statusCode).to.equal(302)
      expect(response.headers.location).to.contain('google.com')
      done()
    })
  })
})
