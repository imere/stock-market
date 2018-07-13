const compression = require('compression')
const express = require('express')
const app = express()
const https = require('https').Server(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: https })
const bodyParser = require('body-parser')
const path = require('path')

const port = process.env.PORT || 8000

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../dist/')))

const stockApi = require('./stockApi')
app.use('/', stockApi)

https.listen(port, () => {
  console.log(`Listening on ${ port }`)
})

wss.on('connection', ws => {
  ws.on('message', msg => {
    wss.clients.forEach(client => {
      if (client !== ws &&
          client.readyState === WebSocket.OPEN) {
        client.send(msg)
      }
    })
  })
})
