'use strict'

module.exports = function (server) {
  server.auth.strategy('google-oauth', 'bell', {
    provider: 'google',
    password: 'PASS',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    isSecure: false,
    scope: ['email', 'https://www.googleapis.com/auth/calendar.readonly']
  })
}
