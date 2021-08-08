// Web サーバとして動作させる場合のサンプル
// var http = require('http');
// var server = http.createServer(function(req, res) {
//   res.write("Hello world!\n");
//   res.end();
// }).listen(8080);

// GET パラメータを受け取る
// GET のパラメータは req.url で受け取れますが、url モジュールを用いてこれをパースすることができます。

var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
  var url_parse = url.parse(req.url, true);
  console.log(url_parse);
  res.end();
}).listen(8080);