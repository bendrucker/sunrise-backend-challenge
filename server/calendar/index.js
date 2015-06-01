'use strict'

var routes = require('./routes')
var listCalendars = require('./list')
var listEvents = require('./events')

exports = module.exports = function (server, options, next) {
  routes(server)
  listCalendars(server)
  listEvents(server)
  next()
}
exports.attributes = {
  name: 'calendar'
}
