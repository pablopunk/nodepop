const urllib = require('url')
const express = require('express')
const router = express.Router()
const Anuncio = require('../models/Anuncio')
const { getFilter } = require('../lib/filter')

const itemsPerPage = 4

const getSkipForPage = page => (page - 1) * itemsPerPage
const getPage = req => parseInt(req.query.page) || 1
const isLastPage = (curr, count, itemsPerPage) => curr * itemsPerPage >= count
const replacePage = (url, value) => {
  const parsed = urllib.parse(url, true)
  if (parsed.query.page === undefined) {
    return parsed.search === ''
      ? `${url}?page=${value}`
      : `${url}&page=${value}`
  }
  return url.replace(/(page=)[^&]+/, `page=${value}`)
}

const getPagesNav = req => ({
  prev: replacePage(req.url, getPage(req) - 1),
  next: replacePage(req.url, getPage(req) + 1)
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  Anuncio.list({
    filter: getFilter(req),
    limit: itemsPerPage,
    skip: req.query.page ? getSkipForPage(req.query.page) : 0,
    all: true
  }, (err, data) => {
    if (err) {
      next(err)
      return
    }
    res.render('index', {
      title: 'Anuncios',
      anuncios: data.anuncios,
      tags: data.tags,
      page: getPage(req),
      isLastPage: isLastPage(getPage(req), data.count, itemsPerPage),
      nav: getPagesNav(req)
    })
  })
})

router.get('/lang/:locale', (req, res, next) => {
  const locale = req.params.locale
  res.cookie('nodeapi-lang', locale, { maxAge: 900000, httOnly: true })
  res.redirect(req.get('referer'))
})

module.exports = router
