/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
module.exports = function(ioServer, socket) {
	console.log('A connection made by ' + socket.id);
	socket.on('disconnect', function() {
	    console.log(socket.id + " disconnected");
	});
}