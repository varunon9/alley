/**
    * Created by: Varun kumar
    * Date: 25 april, 2016
    * Hire me. Contact: varunon9@gmail.com
**/

var mongoApi = require('../database');
var redisApi = require('../redis');

module.exports = function (app) {
    app.post('/user/signup', function (req, res) {
        var user = req.body.user;
        //validating here
        //angular username not binding, handle it
        if (!user.username || !user.age || !user.gender) {
            return res.send('incomplete details');
        }
        var successCallback = function () {
            res.cookie('username', user.username, {
                signed: true,
                maxAge: 12 * 30 * 24 * 3600 * 1000
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
            res.send({message: 'success'});
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
            res.send(onlineUsers);
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