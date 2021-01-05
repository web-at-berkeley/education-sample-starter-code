const axios = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/nasa', (req, res) => {
  axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    res.send(error);
  });
})

app.get('/create', (req, res) => {
  let name = req.query.name;
  let type = req.query.type;
  let filename = name + '.' + type;
  fs.appendFile(filename, ' ', (err) => {
    if (err) res.send(err);
    res.send({
      "message": "File created!",
      "name": name,
      "type": type
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})