'use strict'

const Anuncio = require('../models/Anuncio')
const { anuncios } = require('../db.json')

module.exports.init = async function () {
  await Anuncio.deleteMany()
  await Anuncio.insertMany(anuncios)
}
