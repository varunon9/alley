/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
**/

var mongoApi = require('../database');

module.exports = function (app) {
    app.post('/user/signup', function (req, res) {
        var user = req.body.user;
        var successCallback = function () {
            res.cookie('username', user.username, {
                signed: true,
                maxAge: 3 * 30 * 24 * 3600
            });
            res.send('success');
        };
        var errorCallback = function () {
            res.send('exists');
        };
        mongoApi.addUser(user, errorCallback, successCallback);
    });
    app.get('/logout', function (req, res) {
        var username = req.signedCookies.username; 
        var successCallback = function () {
            res.clearCookie('username');
            res.redirect('/about');
        };
        mongoApi.deleteUser(username, successCallback);
    });
};