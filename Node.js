// クライアントからの情報を得る
var http = require('http');
var server = http.createServer(function(req, res) {
  // クライアントからの情報を得る
  console.log("URL: " + req.url);
  console.log("Method: " + req.method);
  console.log("Header[Content-Type]: " + req.headers['content-type']);

  // POST データを受け取る
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
      console.log(body);
      res.end();
    });
  }    
  res.end();
}).listen(8080);

// POST データを受け取る
// var http = require('http');

// var server = http.createServer(function(req, res) {
//   if (req.method == 'POST') {
//     var body = '';
//     req.on('data', function(chunk) {
//         body += chunk;
//     });
//     req.on('end', function() {
//       console.log(body);
//       res.end();
//     });
//   }
// }).listen(8080);