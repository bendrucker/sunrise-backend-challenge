'use strict'

var bell = require('bell')
var google = require('./google')

exports = module.exports = function (server, options, next) {
  server.register(bell, function (err) {
    if (err) return next(err)
    google(server)
    next()
  })
}
exports.attributes = {
  name: 'auth'
}
