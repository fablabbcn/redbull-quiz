const express = require('express')
const app = express()

var bodyParser = require('body-parser')
var cors = require('cors')
var csv = require('csv')
var fs = require ('fs')

app.use( express.json() )
app.use( express.urlencoded() )
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/logs', function(req, res){
  console.log(req.body.msg);
  res.send('ok');

  fs.appendFile("../log.txt", req.body.msg + "\n", function(err){
    if (err) {
      return console.log(err);
    }
    //console.log('saved')
  })

})

app.listen(8000, () => console.log('listening on port 8000'))
