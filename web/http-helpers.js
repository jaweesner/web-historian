var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, status) {
  // Write some code here that helps serve up your static files!
  //input: response stream, file to serve, callback takes in the response that has been written to. 
  //output: whatever happens in callback, and side effect of writing assset to res response
  //currently, no headers written

  status = status || 200;//callback(res);
  fs.readFile (asset, 'utf8', function(err, data) {
    if (err) {
      res.writeHead(400, exports.headers);
      res.end();
      console.log(err);
    } else {
      res.writeHead(status, exports.headers);
      res.write(data);
      res.end();
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
