'use strict'

module.exports = function (server) {
  server.route({
    method: ['GET', 'POST'],
    path: '/authenticate',
    config: {
      auth: 'google',
      handler: function (request, reply) {
        reply(request.auth.credentials.token)
      }
    }
  })
}
