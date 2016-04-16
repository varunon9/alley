/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var io = require('socket.io');

app.use(bodyParser.json({
    limit: '2mb'
})); // support json encoded bodies
app.use(bodyParser.urlencoded({
    limit: '2mb',
    extended: true
})); // support encoded bodies

require('./router/routes')(app);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var server = app.listen(4000, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
});

var ioServer = io.listen(server);

ioServer.on('connection', function(socket) {
    require('./app/socket')(ioServer, socket);
});