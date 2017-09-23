const express = require('express')
const router = express.Router()
const { get } = require('axios')

const apiUrl = 'http://localhost:3000/apiv1'

const tagLimit = 6
const itemsPerPage = 6

const getSkipForPage = page => (page - 1) * tagLimit
const getPage = req => parseInt(req.query.page) || 1
const isLastPage = (curr, count, itemsPerPage) => curr * itemsPerPage >= count

/* GET home page. */
router.get('/', async (req, res, next) => {
  get(`${apiUrl}/anuncios`, {
    params: Object.assign(
      {},
      {
        limit: itemsPerPage,
        skip: req.query.page ? getSkipForPage(req.query.page) : 0,
        count: true
      },
      req.query
    )
  })
    .then(anuncios =>
      get(`${apiUrl}/anuncios/tags`, {
        params: { limit: tagLimit }
      }).then(tags =>
        res.render('index', {
          title: 'Anuncios',
          anuncios: anuncios.data.data,
          tags: tags.data,
          page: getPage(req),
          isLastPage: isLastPage(getPage(req), anuncios.data.count, itemsPerPage)
        })
      )
    )
    .catch(next)
})

module.exports = router
