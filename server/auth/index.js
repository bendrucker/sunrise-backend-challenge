'use strict'

var bell = require('bell')
var google = require('./google')
var route = require('./route')

exports = module.exports = function (server, options, next) {
  server.register(bell, function (err) {
    if (err) return next(err)
    google(server)
    route(server)
    next()
  })
}
exports.attributes = {
  name: 'auth'
}
