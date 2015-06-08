'use strict'

var express = require('express')
var routes = require('./routes')

module.exports = routes(express())
