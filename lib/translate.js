const locales = require('./locales')
const defaultLang = 'en'

module.exports = (msg, lang) => {
  if (lang === defaultLang) {
    return msg
  }
  if (locales[msg]) {
    return locales[msg][lang] || msg
  }
  return msg
}
