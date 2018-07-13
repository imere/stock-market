const axios = require('axios')

const code = 'A'
  axios.delete('47.95.217.180:8000/api/stock',{ code })
    .catch(ex => {
      console.log(ex)
    })
