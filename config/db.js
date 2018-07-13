const mg = require('mongoose')

const uri = process.env.uri

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
