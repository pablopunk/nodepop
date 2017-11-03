'use strict'

const test = require('ava').serial
const request = require('supertest')
const { Mockgoose } = require('mockgoose')
const mongoose = require('mongoose')
const fixtures = require('./fixtures')

mongoose.Promise = global.Promise
const mockgoose = new Mockgoose(mongoose)

const apiUrl = '/apiv1/anuncios'
let agent

test.before(async function () {
  await mockgoose.prepareStorage()
  await mongoose.connect('mongodb://example.com/testDB', {
    useMongoClient: true
  })
  mongoose.models = {}
  mongoose.modelSchemas = {}

  agent = request.agent(require('../app'))
})

test.beforeEach(async () => {
  await fixtures.init()
})

test('Retorna un codigo 200', async t => {
  const res = await agent.get(apiUrl)
  t.is(res.statusCode, 200)
})

test('Retorna un JSON en utf-8', async t => {
  const res = await agent.get(apiUrl)
  t.is(res.headers['content-type'], 'application/json; charset=utf-8')
})

test('Retorna una lista de anuncios', async t => {
  const res = await agent.get(apiUrl)
  t.true(Array.isArray(res.body))
  t.is(res.body.length, 7)
})

test('Inserta un anuncio nuevo', async t => {
  const res = await agent
    .post(apiUrl)
    .send({ nombre: 'Nuevo anuncio' })
  t.is(res.body.nombre, 'Nuevo anuncio')
})

test('Borra un anuncio', async t => {
  const res = await agent
    .post(apiUrl)
    .send({ nombre: 'Anuncio a borrar' })
  await agent
    .delete(`${apiUrl}/${res.body._id}`)
    .then(() => t.pass())
})

test('Lanza un error al borrar un anuncio desconocido', async t => {
  await agent
    .delete(`${apiUrl}/foo`)
    .then(({ statusCode }) => {
      t.is(statusCode, 500)
    })
})

test('Modifica un anuncio existente', async t => {
  const resPlain = await agent.get(apiUrl)
  const anuncio = resPlain.body[0]
  await agent
    .put(`${apiUrl}/${anuncio._id}`)
    .send({ nombre: 'Modificado' })
  const resModified = await agent
    .get(apiUrl)
  t.is(resModified.body[0].nombre, 'Modificado')
})
