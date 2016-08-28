/**
 * Created by varun on 28/8/16.
 */

var mysqlConn = require('./mysql');
//log for bot chat
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/alley-bot.log', {flags : 'a'});
var log_stdout = process.stdout;

console.info = function(d) { //
    log_file.write(util.format(d) + '\n');
    //log_stdout.write(util.format(d) + '\n');
};

var alleyBot = {
   reply: function (replyCallback, message) {
       console.info('user: ' + message.value);
       //http://dev.mysql.com/doc/refman/5.7/en/fulltext-natural-language.html
       mysqlConn.query('select answer, match (question) against (? in natural language mode) as score from greetAndAboutBot where match (question) against (? in natural language mode)',
           [message.value, message.value], function (err, rows, fields) {
               if (err) {
                   console.error(err);
               } else if (rows && rows[0] && rows[0].score > 0.5) {
                   message.value = rows[0].answer;
                   console.info('score: ' + rows[0].score);
               }
               console.info('alley-bot: ' + message.value);
               console.info('----------------');
               replyCallback(message);
           }
       );
   }
};
module.exports = alleyBot;
