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
    app.post('/getUserDetails', function (req, res) {
        var username = req.signedCookies.username;
        var callback = function (user) {
            res.send(user);
        };
        mongoApi.getUser(username, callback);
    });
    app.post('/getAllOnlineUsers', function (req, res) {
        var callback = function (onlineUsers) {
            if (req.signedCookies.username != null) {
                res.send(onlineUsers);
            } else {
                res.send('no signup');
            }
        };
        mongoApi.getAllOnlineUsers(callback);
    });
    app.post('/getCountOfOnlineUsers', function (req, res) { 
        var callback = function (count) {;
            res.send(JSON.stringify({'count': count}));
        };
        mongoApi.getCountOfOnlineUsers(callback);
    });
};