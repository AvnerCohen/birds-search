var solr = require('solr');
var fs = require('fs');
var cheerio = require('cheerio');
var log = require("./log").log;


var client = solr.createClient();

//Loop through files in birds-kb.
//Load content.
//Extract: title
//Extract: keywords
//extract body
var BASE_PATH = "./birds-kb/";
var files = fs.readdirSync(BASE_PATH);
var counter = 0;
//Loop through files and extract important content
for (var i = 0; i < files.length; i++) {
    var data = fs.readFileSync(BASE_PATH + files[i] ,"utf8");
    var doc = cheerio.load(data);

    var title = doc("h1").text();
    if (title === ""){
      log("No title in:" + files[i]);
      continue;
    }
    var doc = {
      id: counter++,
      title_t : title,
      body_t : doc("div#bodyContent").text()
    };
  client.add(doc, done); 
}
function done(){
   client.commit();

}

function parseData(err, data) {}