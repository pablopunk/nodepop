'use strict'

const { join } = require('path')
const i18n = require('i18n')

module.exports = function (defaultLocale = 'en') {
  i18n.configure({
    directory: join(__dirname, '..', 'locales'),
    locales: ['es', 'en', 'gl'],
    defaultLocale: defaultLocale,
    syncFiles: true,
    objectNotation: true,
    queryParameter: 'lang',
    register: global,
    cookie: 'nodeapi-lang'
  })

  i18n.setLocale(defaultLocale)
  return i18n
}
