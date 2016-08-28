/**
 * Created by varun on 28/8/16.
 */

var mysql = require('mysql');
var constants = require('./constants');

var con = mysql.createConnection({
    host: constants.mysqlHost,
    user: constants.mysqlUsername,
    password: constants.mysqlPassword,
    database: constants.mysqlDatabase
});

module.exports = con;