/**
 * Created by varun on 28/8/16.
 */

var mysql = require('mysql');
var fs = require('fs');
var constants = require('./constants');

var con = mysql.createConnection({
    host: constants.mysqlHost,
    user: constants.mysqlUsername,
    password: constants.mysqlPassword,
    database: constants.mysqlDatabase
});

var data = require('../data/greeting.json');

data.forEach(function (dataObject) {
    var question = dataObject.question;
    var answer = dataObject.answer;
    con.query('insert into greetAndAboutBot (question, answer) values(?, ?)', [question, answer], function (err, res) {
        if (err) {
            console.log(err);
        }
    });
});
