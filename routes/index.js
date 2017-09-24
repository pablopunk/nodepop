const urllib = require('url')
const express = require('express')
const router = express.Router()
const { get } = require('axios')

const apiUrl = 'http://localhost:3000/apiv1'

const tagLimit = 6
const itemsPerPage = 2

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
  return url.replace(/(page=)[^\&]+/, `page=${value}`)
}

const getPagesNav = req => ({
  prev: replacePage(req.url, getPage(req) - 1),
  next: replacePage(req.url, getPage(req) + 1)
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  get(`${apiUrl}/anuncios`, {
    params: Object.assign(
      {},
      {
        limit: itemsPerPage,
        skip: req.query.page ? getSkipForPage(req.query.page) : 0,
        all: true
      },
      req.query
    )
  })
    .then(fetched =>
      res.render('index', {
        title: 'Anuncios',
        anuncios: fetched.data.anuncios,
        tags: fetched.data.tags,
        page: getPage(req),
        isLastPage: isLastPage(getPage(req), fetched.data.count, itemsPerPage),
        nav: getPagesNav(req)
      })
    )
    .catch(next)
})

module.exports = router
