'use strict'

const { __ } = require('./config-i18n')()

module.exports = (err, lang = 'en') => {
  const message = __(err.message, lang)
  return Object.assign(err, { message })
}
