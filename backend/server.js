const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const fs = require('fs')
app.use(cors())
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

function dataURLtoFile(data, filename) {
  var base64Data = data.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(filename, base64Data, 'base64', function(err) {
    console.log(err);  })
}

app.post('/saveImg', (req, res) => {
    // console.log(req.body.imData)
    dataURLtoFile(req.body.imData, 'canvas.png')
    return res.json({msg: 'recieved!'})
})


app.get('/img', (req, res) => {

  res.sendFile('/Users/saru/arvr/whiteboard/backend/canvas.png');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})