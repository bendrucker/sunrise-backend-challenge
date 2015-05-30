'use strict'

var Boom = require('boom')

module.exports = function (server, options) {
  return {
    authenticate: function (request, reply) {
      var token = request.query.accessToken
      delete request.query.accessToken
      if (!token) return reply(Boom.unauthorized('Missing accessToken query param', 'Query'))
      reply.continue({credentials: {token: token}})
    }
  }
}
