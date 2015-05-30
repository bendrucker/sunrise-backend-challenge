'use strict'

var bell = require('bell')
var google = require('./google')
var route = require('./route')
var query = require('./query')

exports = module.exports = function (server, options, next) {
  server.register(bell, function (err) {
    if (err) return next(err)
    google(server)
    route(server)
    server.auth.scheme('query', query)
    server.auth.strategy('google', 'query', 'required')
    next()
  })
}
exports.attributes = {
  name: 'auth'
}
