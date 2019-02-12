const path = require('path')
const publicPath = path.join(__dirname,'../public')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static(publicPath))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))