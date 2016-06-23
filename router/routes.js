/**
    * Created by: Varun kumar
    * Date: 30 march, 2016
**/

var redisApi = require('../app/redis');

module.exports = function (app) {
	app.get('/', function (req, res) {
        var username = req.signedCookies.username;
        console.log(username + ' from route');
        if (username != null) {
            //to prevent opening of multiple tabs
            var callback = function (id) {
                if (!id) {
                    res.render('./index.html', {username: username});
                } else {
                    res.redirect('/about');
                }
            };
            redisApi.getUserIdRedis(username, callback);
        } else {
            res.render('./index.html', {username: username});
        }
	});
    app.get('/home', function (req, res) {
        res.render('./home.html');
    });
    app.get('/chat', function (req, res) {
        res.render('./chat.html');
    });
    app.get('/signup', function (req, res) {
        res.render('./signup.html');
	});
    app.get('/about', function (req, res) {
        res.render('./about.html');
    });
}