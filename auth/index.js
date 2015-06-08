'use strict'

var express = require('express')
var validate = require('./validate')
var routes = require('./routes')

exports = module.exports = validate
exports.routes = routes(express())
