var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    compression = require('compression');
//compress all requests and responses
app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/jobTitles', function(req, res) {
	res.json(['teacher', 'home tutor', 'web developer', 'advocate', 'graphics designer', 'content writer',
	    'doctor', 'hr manager', 'financial manager', 'yoga trainer', 'karate trainer', 'watchman', 
	    'gardener', 'driver', 'java developer']);
});
http.listen(4000, function() {
	console.log("Listening on port: 4000");
});