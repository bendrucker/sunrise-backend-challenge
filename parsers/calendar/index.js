'use strict'

var obstruct = require('obstruction')

module.exports = obstruct({
  id: true,
  title: 'summary',
  color: ['backgroundColor', parseColor],
  writable: ['accessRole', isWriteRole],
  selected: true,
  timezone: 'timeZone'
})

function parseColor (hex) {
  return (hex || '').substring(1)
}

function isWriteRole (role) {
  return role === 'writer' || role === 'owner'
}
