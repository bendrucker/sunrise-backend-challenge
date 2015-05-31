'use strict'

module.exports = function (server) {
  server.route({
    path: '/',
    method: 'get',
    handler: function (request, reply) {
      server.methods.calendars.list(request.auth.credentials.token, reply)
    }
  })
}
