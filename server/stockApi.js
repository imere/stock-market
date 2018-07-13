const router = require('express').Router()
const axios = require('axios')
const Stock = require('../src/config/db')

const key = process.env.key ||
            'DsWorJn4dDgR2jAb5WTn'

const url = 'https://www.quandl.com/api/v3/datasets/WIKI/'

router.get('/api/stock/:code', (req, res) => {
  let code = req.params.code
  if (code) {
    code = code.toUpperCase()
    axios.get(url + code + '.json?api_key=' + key)
      .then(data => {
        data = data.data
        if (data.quandl_error) {
          throw new Error(data.quandl_error.message)
        }
        let name = data.dataset.name
        data = data.dataset.data
        res.json({ code, name, data })
      })
      .catch(ex => {
        return res.status(400).json(ex.response.data || ex.message)
      })
  } else {
    next()
  }
})

router.get('/api/stock', (req, res) => {
  Stock.find({}, {
    _id: 0,
    __v: 0
  }, (err, docs) => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.json(docs)
  })
})

router.delete('/api/stock/:code', (req, res) => {
  if (!req.params.code) {
    return res.status(400).json({ msg: 'Bad Request' })
  }
  let code = req.params.code.toUpperCase()
  Stock.deleteMany({
    code: code
  }, err => {
    if (err) {
      return res.status(500).json({ ok: false })
    }
    res.status(204).json({ ok: true })
  })
})

router.put('/api/stock', (req, res) => {
  if (!req.body.code) {
    return res.status(400).json({ msg: 'Bad Request' })
  }
  let code = req.body.code.toUpperCase()
  axios.get(url + code + '.json?api_key=' + key)
    .then(data => {
      data = data.data
      if (data.quandl_error) {
        throw new Error(data.quandl_error.message)
      }
      Stock.find({
        code: code
      }, (err, docs) => {
        data = data.dataset
        let name = data.name
        data = data.data
        if (err) {
          return res.status(500).json({ ok: false })
        } else if (docs.length) {
          return res.status(400).json({ msg: 'Exist', code, name, data })
        }

        Stock.insertMany({
          code: code
        }, (err, docs) => {
          if (err) {
            return res.status(500).json({ ok: false })
          }
          res.json({ code, name, data })
        })

      })
    })
    .catch(ex => {
      res.status(400).json(ex.response.data || ex.message)
    })
})

module.exports = router
