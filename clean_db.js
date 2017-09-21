'use strict'

const mongoose = require('mongoose')
const Anuncio = require('./models/Anuncio')
const newData = require('./anuncios.json')
require('./lib/connect_db')

// Remove all
Anuncio.remove({}, () =>
  Anuncio.insertMany(newData.anuncios, () =>
    mongoose.connection.close()))
