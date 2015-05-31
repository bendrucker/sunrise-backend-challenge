'use strict'

var Joi = require('joi')

module.exports = function (server) {
  server.route({
    path: '/',
    method: 'get',
    handler: function (request, reply) {
      server.methods.calendars.list(request.auth.credentials.token, reply)
    }
  })
  server.route({
    path: '/{calendarId}/events',
    method: 'get',
    handler: function (request, reply) {
      var calendarId = request.params.calendarId
      server.methods.events.list(calendarId, request.auth.credentials.token, reply)
    },
    config: {
      validate: {
        params: {
          calendarId: Joi.string().required()
        }
      }
    }
  })
}
