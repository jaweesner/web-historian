var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(data.toString().split(/\n/));
    }
  });
};


exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(data.toString().indexOf(url) >= 0);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList( url, function(exists) {
    if (!exists) {
      fs.appendFile(exports.paths.list, url + '\n', () => { 
        
      });
    }
    if (callback) {callback();}
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(path.join(exports.paths.archivedSites, url), function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function (urls) {
    urls.forEach( (site) => {
      
      if (site){
      exports.isUrlArchived(site, (exists) => {
        var archivepath = path.join(exports.paths.archivedSites, site);
        if (!exists) {
          fs.open(archivepath, 'w', (err, fd) => {
            var options = {
              host:site,
              path:'/',
              method:'GET'
            };

            req = https.request(options, (res) => {
              var body = [];
              res.on('error', (err) => console.log(err))
              res.on('data', (chunk) => {
                body.push(chunk);
              });
              res.on('end', (err) => {
                if (err){console.log(err)};
                fs.write(fd, body.join(''), () => { fs.close(fd); })
                
              });
            });
            req.on('error', (err) => console.log(err))
            req.end();
          });
        }
      });
    }
    });
};
