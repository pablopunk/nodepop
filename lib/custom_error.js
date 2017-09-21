'use strict'

const translate = require('./translate')

module.exports = (err, lang) => {
  let message = err.message || 'Unkown error'
  if (message.includes('Cast to ObjectId')) {
    message = 'Object not found'
  } else if (message.includes('Cast to number failed')) {
    message = 'Error parsing number'
  }
  message = translate(message, lang)
  return Object.assign(err, { message })
}
