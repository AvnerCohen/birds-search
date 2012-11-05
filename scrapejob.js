#! /usr/bin/env node

var nodeio = require('node.io');
var options = {
    timeout: 1,
    max: 20
};
var fs = require('fs');
var species = process.argv[2];


function scrapeWikiPage(species_name) {
    nodeio.scrape(function() {
        this.get('http://en.wikipedia.org/wiki/' + species_name, function(err, data) {
            saveToDisk(species_name, data);
        });
    });
}

function saveToDisk(species_name, data) {
    var stream = fs.createWriteStream("./birds-kb/" + species_name + "_data.txt");
    stream.once('open', function(fd) {
        stream.write(data + "\n");
    });
}

function doIt() {
    for (var i = 0; i < species.length; i++) {
        scrapeWikiPage(species[i]);
    }
}


doIt();