//import{ isUrlArchived } from '../helpers/archive-helpers';

var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    httpHelp.serveAssets(res, path.join(archive.paths.siteAssets, 'index.html'));
  } else if (req.url === '/' && req.method === 'POST') {
    console.log('hit post');
    var site;
    var body = '';
    req.on('data', (chunk) => {
      body = body + (chunk.toString());
    }).on('end', () => {
      site = body.split("url=", 2);
      site = site.length === 1 ? site[0] : site[1];
      console.log(site);
      archive.addUrlToList(site, () => {
        archive.isUrlArchived(site, (exists)=>{
          if (exists){
            console.log('site archived:' + site);
            httpHelp.serveAssets(res, path.join(archive.paths.archivedSites, site), 302);
        } else {
          console.log("archiving");
            archive.readListOfUrls((list) => {
              console.log('list of URLS: '+ list); 
              archive.downloadUrls(list);
            });
            httpHelp.serveAssets(res, path.join(archive.paths.siteAssets, 'loading.html'), 302);
          }
        });
    });
  }) 
  } else {
    archive.isUrlArchived(req.url, function(exists) {
      if (!exists) {
        res.writeHead(404, httpHelp.headers);
        res.end();
      } else {
        httpHelp.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
      }
    });
  
  // if (req.method === 'GET') { 
  //   httpHelp.serveAssets(res, path.join(archive.paths.siteAssets, 'index.html'));
  // }

// res.end(archive.paths.list);
};
}
