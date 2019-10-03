const express = require('express')
const app = express()

var bodyParser = require('body-parser')
var cors = require('cors')
var fs = require ('fs')

app.use( express.json() )
app.use( express.urlencoded() )
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/email', function(req, res){
  res.send('received email');
  fs.appendFile("../email.txt", req.body.email + "\n", function(err){
    if (err) {
      return console.log(err);
    }
  })
})

app.post('/logs', function(req, res){
  res.send('received log');
  finalline =
    req.body.email  + "," +
    req.body.startTime + "," +
    req.body.endTime   + "," +
    req.body.totalExp  + "," +
    req.body.guesses   + "\n"

  fs.appendFile("../log.txt", finalline, function(err){
    if (err) {
      return console.log(err);
    }
    //console.log('saved')
  })

})

app.listen(8000, () => console.log('listening on port 8000'))
