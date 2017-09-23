'use strict'

const mongoose = require('mongoose')
const shuffle = require('array-shuffle')

const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
})

anuncioSchema.statics.list = (options, callback) => {
  const filter = options.filter || {}
  const query = Anuncio.find(filter)
  if (options.skip !== null) {
    query.skip(parseInt(options.skip))
  }
  if (options.limit !== null) {
    query.limit(parseInt(options.limit))
  }
  query.exec((err, data) => {
    if (err) {
      callback(err)
      return
    }
    if (options.count) {
      Anuncio.count(filter, (err, count) => {
        if (err) {
          callback(err)
          return
        }
        callback(null, { data, count })
      })
    } else {
      callback(null, data)
    }
  })
}

anuncioSchema.statics.listTags = (options, callback) => {
  Anuncio.find().distinct('tags', (err, data) => {
    if (err) {
      callback(err)
      return
    }
    const skip = options.skip ? parseInt(options.skip) : 0
    const limit = options.limit ? parseInt(options.limit) : data.length
    if (options.shuffle) {
      data = shuffle(data)
    }
    callback(null, data.slice(skip, skip + limit))
  })
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema)

module.exports = Anuncio
