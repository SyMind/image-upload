var express = require('express');
var app = express();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var fs = require('fs');
var source = fs.createReadStream(path)

app.use(express.static('test'));
app.use('/lib', express.static('lib'));
app.use('/src', express.static('src'));
app.use('/static', express.static('static'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/post', multipartMiddleware, function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');  
  
  console.log('get FormData Params: ', req.files);  
  
  res.json({result: 'success', data: req.files});  
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Example app listening at http://%s:%s', host, port);
});