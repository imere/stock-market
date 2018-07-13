const mg = require('mongoose')

const uri = process.env.uri ||
            'mongodb://imere:838914662imere@ds141720.mlab.com:41720/stock'

mg.connect(uri, { useNewUrlParser: true })

const stockSchema = {
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  }
}

const Stock = mg.model('stock', stockSchema)

module.exports = Stock
