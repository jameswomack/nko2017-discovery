var http = require('http')
var httpProxy = require('http-proxy')

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
  if (req.url.match(/\/badge\//)) {
    proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
  } else if (req.url.match(/\/chat\//)) {
    proxy.web(req, res, { target: 'http://127.0.0.1:8081' });
  } else {
    proxy.web(req, res, { target: 'http://127.0.0.1:8082' });
  }
});

console.log(`listening on port ${process.env.PORT}`)
server.listen(process.env.PORT || 5050);
