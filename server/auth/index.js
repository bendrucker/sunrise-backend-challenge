'use strict'

var bell = require('bell')
var google = require('./google')
var routes = require('./routes')

exports = module.exports = function (server, options, next) {
  server.register(bell, function (err) {
    if (err) return next(err)
    google(server)
    routes(server)
    next()
  })
}
exports.attributes = {
  name: 'auth'
}
