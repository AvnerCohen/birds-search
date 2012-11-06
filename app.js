var http = require('http');
var director = require('director');
var log = require("./log").log;
var solr = require('solr');
var union = require('union');
var ecstatic = require('ecstatic');

var client = solr.createClient();


function solrSearch(searchterm) {
    var query = 'title_t:' + searchterm;
    var that = this;
    client.query(query, function(err, response) {
        if (err) throw err;
        var responseObj = JSON.parse(response);
        that.res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        that.res.end(response);

    });
}

//##### The flatiron-director router
var router = new director.http.Router({
    '/search/:searchterm': {
        get: solrSearch
    }
});


var server = union.createServer({
    before: [
    function(req, res) {
        var found = router.dispatch(req, res);
        if (!found) {
            res.emit('next');
        }
    },
    ecstatic(__dirname + '/public')]
});


server.listen(8080);
console.log('Listening on http://127.0.0.1:8080');