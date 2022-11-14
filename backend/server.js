const pdf2pic = require("pdf2pic");
const express = require('express')
const cors = require('cors')
const pdf = require('pdf-page-counter');
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const fs = require('fs')
var pageNumber = 1;

app.use(cors())
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

function dataURLtoFile(data, filename) {
  var base64Data = data.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(filename, base64Data, 'base64', function (err) {
    console.log(err);
  })
}

function pdftopic(pdfPath) {
  console.log('hi')
  let dataBuffer = fs.readFileSync(pdfPath);
  pdf(dataBuffer).then(function (data) {
    var numPages = data.numpages;
    console.log(data)
    const options = {
      density: 100,
      saveFilename: "slides",
      savePath: "./images",
      format: "png",
      width: 600,
      height: 600
    };
    const storeAsImage = pdf2pic.fromPath(pdfPath, options);

    for (let i = 1; i <= numPages; i++) {
      storeAsImage(i).then((resolve) => {
        console.log(resolve); // send resolve to user
      });
      // pdf2pic.fromBase64(pdfData, options).convert(i, isBase64)
    }
  })
}


app.post('/saveImg', (req, res) => {
  // console.log(req.body.imData)
  dataURLtoFile(req.body.imData, 'canvas.png')
  return res.json({ msg: 'recieved!' })
})

app.post('/savePdf', (req, res) => {
  // console.log(req.body.imData)
  pdfData = req.body.pdf.split(',')[1];
  // console.log(pdfData)
  var binary = atob(pdfData)
  fs.writeFileSync('slides.pdf', binary, 'binary')
  pdftopic('slides.pdf')
  // pdftopic(pdfData, 10);
  return res.json({ msg: 'recieved!' })
})


app.get('/img', (req, res) => {

  res.sendFile('/Users/saru/arvr/whiteboard/backend/canvas.png');
})

app.get('/slide', (req, res) => {
  pageNo = req.query.pageNo;
  if (Object.keys(req.query).length !== 0){
  res.sendFile(`/Users/saru/arvr/whiteboard/backend/images/slides.${pageNo}.png`)}
  else {
    res.sendFile(`/Users/saru/arvr/whiteboard/backend/images/slides.${pageNumber}.png`)}
  }
)

app.post('/setSlide', (req, res)=> {
  pageNumber = req.body.pageNo
  console.log('hey')
  res.json({msg:'done'})
})

app.get('/thing', (req, res) => {
  pdftopic();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})