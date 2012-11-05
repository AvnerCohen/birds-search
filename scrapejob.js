#! /usr/bin/env node

var nodeio = require('node.io');
var options = {timeout: 1, max: 20};

var job = new nodeio.Job(options, {
  input : null,//dummy 
    run: function (keyword) {
      console.log("runnnnn");
        this.getHtml('http://www.google.com/search?q=' + encodeURIComponent(keyword), function (err, $) {
            var results = $('#resultStats').text.toLowerCase();
            this.emit(keyword + ' has ' + results);
        });
    },
    output: function(text){
      console.log(text);
    }
});

job.input = process.argv;
//execute
job.run();