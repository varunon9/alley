/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('./index.html');
	});
    app.get('/users', function(req, res) {
		res.render('./users.html');
	});
}