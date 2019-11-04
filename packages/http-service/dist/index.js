
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./http-service.cjs.production.min.js')
} else {
  module.exports = require('./http-service.cjs.development.js')
}
