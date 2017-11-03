/* global describe, before, beforeEach, it */
'use strict'

const assert = require('assert')
const request = require('supertest')
const { Mockgoose } = require('mockgoose')
const mongoose = require('mongoose')
const fixtures = require('./fixtures')

mongoose.Promise = global.Promise
const mockgoose = new Mockgoose(mongoose)

let app

const apiUrl = '/apiv1/anuncios'
describe('Funciones de la API', function () {
  let agent
  before(async function () {
    await mockgoose.prepareStorage()
    await mongoose.connect('mongodb://example.com/testDB', {
      useMongoClient: true
    })
    mongoose.models = {}
    mongoose.modelSchemas = {}

    app = require('../app')
    agent = request.agent(app)
  })

  beforeEach(async () => {
    await fixtures.init()
  })

  it('Retorna un codigo 200', function (done) {
    agent
      .get(apiUrl)
      .expect(200, done)
  })

  it('Retorna un JSON en utf-8', function (done) {
    agent
      .get(apiUrl)
      .expect('Content-Type', 'application/json; charset=utf-8', done)
  })

  it('Retorna una lista de anuncios', function () {
    request(app)
      .get(apiUrl)
      .then(({ body }) => {
        assert.ok(Array.isArray(body))
        assert.equal(body.length, 7)
      })
  })

  it('Inserta un anuncio nuevo', function () {
    agent
      .post(apiUrl)
      .send({ nombre: 'Nuevo anuncio' })
      .then(({ body }) => {
        assert.equal(body.nombre, 'Nuevo anuncio')
      })
  })

  it('Borra un anuncio', function (done) {
    agent
      .post(apiUrl)
      .send({ nombre: 'Anuncio a borrar' })
      .then(({ body }) => {
        agent
          .delete(`${apiUrl}/${body._id}`)
          .then(() => done())
      })
  })

  it('Lanza un error al borrar un anuncio desconocido', function () {
    agent
      .delete(`${apiUrl}/foo`)
      .then(({ statusCode }) => {
        assert.equal(statusCode, 500)
      })
  })

  it('Modifica un anuncio existente', function () {
    agent
      .get(apiUrl)
      .then(({ body }) => {
        const anuncio = body[0]
        agent
          .put(`${apiUrl}/${anuncio._id}`)
          .send({ nombre: 'Modificado' })
          .then(() => {
            agent
              .get(apiUrl)
              .then(({ body }) => {
                const anuncioModificado = body[0]
                assert.equal(anuncioModificado.nombre, 'Modificado')
              })
          })
      })
  })
})
