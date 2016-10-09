/**
 * Created by varun on 2/9/16.
 */
var pos = require('pos');
var constants = require('./constants');

//W = wh word, A = Auxiliary Verbs, S = subject, V = verb, O = Object
var userDetails = [];//array of text
var nlp = {
    parse: function (text) {
        var ruleString = '';
        var data = {
            tense: constants.PRESENT,
            subType: constants.SIMPLE,
            sentenceType: constants.ASSERTIVE,
            verb: [],
            noun: [],
            about: constants.OTHER,
            fact: false,
            whQuestion: {
                isWh: false,
                word: ''
            }
        };
        text = text.toLowerCase();
        var words = new pos.Lexer().lex(text);
        var tagger = new pos.Tagger();
        var taggedWords = tagger.tag(words);
        if (taggedWords.length >= 3) {
            //will check for tense and type of sentence
            for (var i = 0; i < taggedWords.length; i++) {
                var taggedWord = taggedWords[i];
                var word = taggedWord[0].toLowerCase();
                var tag = taggedWord[1];
                //checking for don't doesn't won't hadn't hasn't haven't etc
                if (word == 't') {
                    if (taggedWords[i - 1] && taggedWords[i- 1][0] == "'") {
                        data.sentenceType = constants.NEGATIVE;
                        //doesn't -> doesn t , pop doesn
                        data.noun.pop();
                    }
                } else if ((word == 'been') && (taggedWords[i + 1] && taggedWords[i + 1][1] == 'VBG')) {
                    var j = i;
                    if (taggedWords[j - 1] && taggedWords[j - 1][0] == 'not') {
                        j --;
                    }
                    if (taggedWords[j - 1]) {
                        if (taggedWords[j - 1][0] == 'has' || taggedWords[j - 1][0] == 'have') {
                            data.subType = constants.PERFECT_CONTINUOUS;
                            if (data.tense != constants.FUTURE) {
                                data.tense = constants.PRESENT;
                            }
                        } else if (taggedWords[j - 1][0] == 'had') {
                            data.tense = constants.PAST;
                            data.subType = constants.PERFECT_CONTINUOUS;
                        }
                    }
                } else if (word == 'shall' || word == 'will') {
                    data.tense = constants.FUTURE;
                } else if (word == 'not' || word == 'never') {
                    //check if subject is present
                    if (ruleString.indexOf('S') != -1) {
                        data.sentenceType = constants.NEGATIVE;
                    }
                }
                if ((tag == 'NN' || tag == 'NNS' || tag == 'NNP' || tag == 'NNPS') && (word != 't')) {
                    //to avoid classification of i as noun
                    if (word != 'i') {
                        data.noun.push(word);
                        if (ruleString.indexOf('S') == -1) {
                            //got subject
                            ruleString += 'S';
                        } else {
                            //got Object
                            ruleString += 'O';
                        }
                    } else {
                        data.about = constants.USER;
                        //got subject
                        ruleString += 'S';
                    }
                //past main verb
                } else if ((tag == 'VBD' || tag == 'VBN') && (ruleString.indexOf('S') != -1)) {
                    data.verb.push(word);
                    ruleString += 'V';
                    if (tag == 'VBD') {
                        //i ate it. he was eating.
                        //past tense
                        data.tense = constants.PAST;
                    } else if (data.subType != constants.PERFECT_CONTINUOUS) {
                        //i have been beaten
                        data.subType = constants.PERFECT;
                    }
                    if (taggedWords[i - 1] && word != 'been') {
                        if (taggedWords[i - 1][0] == 'had') {
                            data.tense = constants.PAST;
                            data.subType = constants.PERFECT;
                        } else if (taggedWords[i - 1][0] == 'has' || taggedWords[i - 1][0] == 'have') {
                            data.subType = constants.PERFECT;
                            if (data.tense != constants.FUTURE) {
                                data.tense = constants.PRESENT;
                            }
                        //past auxiliary verb
                        }
                    }
                //do does did had have has are is am was were can could shall
                //no prior subject
                } else if ((tag == 'MD' || tag.indexOf('VB') != -1) && (ruleString.indexOf('S') == -1)) {
                    if (tag == 'VBD') {
                        data.tense = constants.PAST;
                    }
                    if (tag != 'VB') {
                        data.sentenceType = constants.INTERROGATIVE;
                    } else {
                        //follow me, do not copy me i.e. imperative
                        data.sentenceType = constants.IMPERATIVE;
                    }
                } else if (tag.indexOf('VB') != -1) {
                    data.verb.push(word);
                    ruleString += 'V';
                    if (tag == 'VBG' && word.length > 4) {
                        if (ruleString.indexOf('S') != -1 && data.subType != constants.PERFECT_CONTINUOUS) {
                            data.subType = constants.CONTINUOUS;
                        } else if (ruleString.indexOf('S') == -1) {
                            //eating is good
                            //treat this as noun
                            data.verb.pop();
                            data.noun.push(word);
                        }
                    }
                } else if (tag == 'PRP' || tag == 'PRP$') {
                    if (ruleString.indexOf('S') == -1) {
                        ruleString += 'S';
                    } else {
                        ruleString += 'O';
                    }
                    if (word == 'i' || word == 'me' || word == 'myself' || word == 'my') {
                        data.about = constants.USER;
                    } else if (word == 'you' || word == 'your' || word == 'yourself') {
                        data.about = constants.BOT;
                    }
                //WDT, WP, WP$, WRB
                } else if (tag.indexOf('W') == 0) {
                    data.sentenceType = constants.INTERROGATIVE;
                    data.whQuestion.isWh = true;
                    data.whQuestion.word = word;
                }
            }
        } else {
            //greet, imperative, exclamatory, others
            //handle separately
        }
        //classifying as fact or remembering for user
        if (data.tense == constants.PRESENT && data.subType == constants.SIMPLE && data.sentenceType != constants.INTERROGATIVE) {
            if (data.about == constants.OTHER) {
                data.fact = true;
            } else {
                //remember for user if not already remembered
                //convert from first person to second person
                data = nlp.saveUserDetail(text, data);
            }
        }
        data.userDetails = userDetails;
        return data;
    },
    saveUserDetail: function (text, data) {
        //check if already remembered
        //algorithm --> check for main verbs and nouns. All must match
        var notFound = 0;
        for (var i = 0; i < userDetails.length && notFound == 0; i++) {
            var userDetail = userDetails[i];
            var tempArray = userDetail.split(' ');
            //checking for main verb
            for (var j = 0; j < data.verb.length && notFound == 0; j++) {
                var verb = data.verb[j];
                if (verb != 'am' && verb != 'do') {
                    for (var k = 0; k < tempArray.length, notFound == 0; k++) {
                        var word = tempArray[k];
                        if (word == verb) {
                            break;
                        }
                    }
                    if (k == tempArray.length) {
                        notFound = 1;
                    }
                }
            }
            //checking for noun
            for (var j = 0; j < data.noun.length && notFound == 0; j++) {
                var noun = data.noun[j];
                for (var k = 0; k < tempArray.length && notFound == 0; k++) {
                    var word = tempArray[k];
                    if (word == noun) {
                        break;
                    }
                }
                if (k == tempArray.length) {
                    notFound = 1;
                }
            }

        }
        if ((notFound == 1) || (notFound == 0 && userDetails.length == 0))  {
            //convert first person to second person and save
            text = nlp.convertFirstPersonToSecondPerson(text);
            userDetails.push(text);
        }
        return data;
    },
    convertFirstPersonToSecondPerson: function (text) {
        var newMessage = '';
        var arr = text.split(' ');
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
    }
};

module.exports = nlp;