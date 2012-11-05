  var http = require('http');
  var director = require('director');
  var log = require("./log").log;
  var solr = require('solr');
  var client = solr.createClient();


function performSolrSearch(searchterm){
  console.log("searched for:"+ searchterm);
  var query = 'title_t:warbler';
  var that = this;
  client.query(query, function(err, response) {
      if (err) throw err;
      var responseObj = JSON.parse(response);
      that.res.writeHead(200, {
          'Content-Type': 'text/html'
      })
      that.res.end(response);
  });
}


  var router = new director.http.Router({
      '/:searchterm': {
          get: performSolrSearch
      }
  });

  var server = http.createServer(function(req, res) {
      router.dispatch(req, res, function(err) {
          if (err) {
              res.writeHead(404);
              res.end();
          }
      });
  });

  server.listen(8080);
  console.log("server listens: http://localhost:8080")