/**
 * Created by varun on 28/8/16.
 */

var mysqlConn = require('./mysql');
var sentenceType = require('./pos');
//log for bot chat
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/alley-bot.log', {flags : 'a'});
//var log_stdout = process.stdout;

console.info = function(d) { //
    log_file.write(util.format(d) + '\n');
    //log_stdout.write(util.format(d) + '\n');
};

var userDetails = [];//learnt information about user
var alleyBot = {
    reply: function (replyCallback, message) {
        console.info('user: ' + message.value);
        //http://dev.mysql.com/doc/refman/5.7/en/fulltext-natural-language.html
        mysqlConn.query('select answer, match (question) against (? in natural language mode) as score from greetAndAboutBot where match (question) against (? in natural language mode)',
            [message.value, message.value], function (err, rows, fields) {
                if (err) {
                    console.error(err);
                } else if (rows && rows[0] && rows[0].score > 1.5) {
                    message.value = rows[0].answer;
                    console.info('score: ' + rows[0].score);
                    alleyBot.printLog(replyCallback, message);
                } else if (message.value.length < 4) {
                    alleyBot.printLog(replyCallback, message);
                } else {
                    //checking for interrogative sentences
                    var lastChar = message.value.charAt(message.value.length - 1);
                    if (lastChar == '?') {
                        //handle interrogative
                        alleyBot.handleInterrogative(replyCallback, message);
                    } else if (lastChar == '!') {
                        //handle exclamatory
                        alleyBot.handleExclamatory(replyCallback, message);
                    } else {
                        //handle assertive, negative,
                        alleyBot.handleAssertive(replyCallback, message);
                    }
                }
            }
        );
    },
    handleInterrogative: function (replyCallback, message) {
        var data = sentenceType.interrogative(message.value);
        if (data.yesNo == true) {
            if (data.aboutBot == true) {
                //framing question. why will i, convert your to my
                var arr = message.value.split(' ');
                var replyMessage = 'Why shall ';
                if (arr[1].toLowerCase() == 'you') {
                    replyMessage += 'I ';
                }
                for (var i = 0; i < arr.length; i++) {
                    if (i > 1) {
                        arr[i] = arr[i].toLowerCase();
                        if (arr[i] == 'your') {
                            arr[i] = 'my';
                        } else if (arr[i] == 'you') {
                            arr[i] = 'I';
                        } else if (arr[i] == 'me') {
                            arr[i] = 'you';
                        } else if (arr[i] == 'my') {
                            arr[i] = 'your';
                        } else if (arr[i] == 'my?') {
                            arr[i] = 'your?';
                        } else if (arr[i] == 'myself') {
                            arr[i] = 'yourself';
                        } else if (arr[i] == 'myself?') {
                            arr[i] = 'yourself?';
                        }
                        replyMessage += arr[i] + ' ';
                    }
                }
                message.value = replyMessage;
                alleyBot.printLog(replyCallback, message);
            } else {
                //search user array. if not found apologise
                message.value = alleyBot.searchUserDetails(data);
                alleyBot.printLog(replyCallback, message);
            }
        } else if (data.whQuestion == true) {
            if (data.aboutBot == true) {
                //search db or what about your ... frame question
                if (data.noun.length > 0) {
                    message.value = 'You tell me, what do you know about ' + data.noun[0] + '?';
                } else {
                    //message.value = 'You ask too many questions.';
                    var newMessage = 'How would it help you to know ';
                    newMessage += alleyBot.convertSecondToFirstPerson(message);
                    message.value = newMessage;
                }
                alleyBot.printLog(replyCallback, message);
            } else if (data.aboutUser == true) {
                //search user array. if not apologise
                message.value = alleyBot.searchUserDetails(data);
                alleyBot.printLog(replyCallback, message);
            } else {
                //search in db
                alleyBot.searchDatabase(replyCallback, message, data.noun);
            }
        } else {
            message.value = 'I have no idea what you are talking about.';
            alleyBot.printLog(replyCallback, message);
        }
    },
    handleExclamatory: function (replyCallback, message) {
        alleyBot.printLog(replyCallback, message);
    },
    handleAssertive: function (replyCallback, message) {
        var data = sentenceType.assertive(message.value);
        if (data.aboutBot == true) {
            //classify about positive or negative. accordingly reply
            var newMessage = 'Why do you think that ';
            newMessage += alleyBot.convertSecondToFirstPerson(message);
            if (data.noun.length > 0) {
                newMessage += 'Can you tell me more about ' + data.noun[0] + '?';
            }
            message.value = newMessage;
            alleyBot.printLog(replyCallback, message);
        } else if (data.aboutUser == true) {
            //learn it and store in user array.
            message.value = alleyBot.checkAndPushUserDetails(message.value, data);
            alleyBot.printLog(replyCallback, message);
        } else {
            //fact learn it if not learnt
            alleyBot.searchDatabase(replyCallback, message, data.noun);
        }
    },
    //printLog also make reply to user
    printLog: function (replyCallback, message) {
        console.info('alley-bot: ' + message.value);
        console.info('----------------');
        replyCallback(message);
    },
    searchUserDetails: function (data) {
        for (var i = 0; i < userDetails.length; i++) {
            var tempArr = userDetails[i].split(' ');
            for (var j = 0; j < data.noun.length; j++) {
                for (var k = 0; k < tempArr.length; k++) {
                    if (data.noun[j] == tempArr[k]) {
                        return userDetails[i];
                    }
                }
            }
        }
        return "I don't know.";
    },
    saveToDatabase: function (sentence) {
        mysqlConn.query('insert into learntFacts (fact) values(?)', [sentence], function (err, res) {
            if (err) {
                console.log(err, 'save Error');
            }
        });
    },
    searchDatabase: function (replyCallback, message, nounArray) {
        var oldMessage = message.value;
        message.value = '';
        for (var i = 0; i < nounArray.length; i++) {
            message.value += nounArray[i] + ' ';
        }
        mysqlConn.query('select fact, match (fact) against (? in natural language mode) as score from learntFacts where match (fact) against (? in natural language mode)',
            [message.value, message.value], function (err, rows, fields) {
                if (err) {
                    console.error(err, 'search error');
                } else if (rows && rows[0] && rows[0].score > 0) {
                    message.value = rows[0].fact;
                } else {
                    //converting first person to second person
                    var newMessage = alleyBot.convertFirstToSecondPerson(oldMessage);
                    alleyBot.saveToDatabase(newMessage);
                    message.value = "I don't think I am getting you. I am not so intelligent.";
                }
                alleyBot.printLog(replyCallback, message);
            }
        );
    },
    convertSecondToFirstPerson: function (message) {
        var newMessage = '';
        var arr = message.value.split(' ');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].toLowerCase();
            if (arr[i] == 'your') {
                arr[i] = 'my';
            } else if (arr[i] == 'yourself') {
                arr[i] = 'myself';
            } else if (arr[i] == 'you') {
                arr[i] = 'I';
            } else if (arr[i] == 'you?') {
                arr[i] = 'I?';
            } else if (arr[i] == 'are') {
                arr[i] = 'am';
            } else if (arr[i] == 'were') {
                arr[i] = 'was';
            }
            newMessage += arr[i] + ' ';
        }
        return newMessage;
    },
    convertFirstToSecondPerson: function (sentence) {
        var newMessage = '';
        var arr = sentence.split(' ');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].toLowerCase();
            if (arr[i] == 'my' || arr[i] == 'our') {
                arr[i] = 'your';
            } else if (arr[i] == 'myself') {
                arr[i] = 'yourself';
            } else if (arr[i] == 'i') {
                arr[i] = 'you';
            } else if (arr[i] == 'am') {
                arr[i] = 'are';
            } else if (arr[i] == 'we') {
                arr[i] = 'you all';
            } else if (arr[i] == 'was') {
                arr[i] = 'were';
            }
            newMessage += arr[i] + ' ';
        }
        return newMessage;
    },
    checkAndPushUserDetails: function (sentence, data) {
        //check if data contains noun
        var newMessage;
        if (data.noun.length > 0) {
            //check if already stored
            newMessage = 'I know, ' + alleyBot.convertFirstToSecondPerson(sentence);
            var found = 0;
            for (var i = 0; i < userDetails.length; i++) {
                var tempArr = userDetails[i].split(' ');
                for (var j = 0; j < data.noun.length; j++) {
                    for (var k = 0; k < tempArr.length; k++) {
                        if (data.noun[j] == tempArr[k]) {
                            found = 1;
                            break;
                        }
                    }
                }
            }
            //if not found, ask for a noun and save
            if (found == 0) {
                userDetails.push(sentence);
                newMessage = data.noun[0] + "? That's seems interesting.";
            }
            return newMessage;
        } else {
            //check for i am intelligent and i am eating mango kind of sentence
            newMessage = 'so nice to tell me about yourself.';
            var tempArr = sentence.split(' ');
            if (tempArr[0] == 'i' && tempArr[1] == 'am') {
                //check foe verb4 e.g verb ending with ing
                if (tempArr[2].length > 4 && tempArr[2].indexOf('ing') != -1) {
                    newMessage = 'Why are you ';
                    for (var i = 2; i < tempArr.length; i++) {
                        newMessage += tempArr[i] + ' ';
                    }
                    newMessage += '? Do you like ' + tempArr[2] + '?';
                } else {
                    newMessage = 'Do you really think you are ';
                    for (var i = 2; i < tempArr.length; i++) {
                        newMessage += tempArr[i] + ' ';
                    }
                    newMessage += '? What makes you ' + tempArr[2] + '?';
                }
            }
        }
        return newMessage;
    }
    
};
module.exports = alleyBot;
