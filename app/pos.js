/**
 * Created by varun on 30/8/16.
 */
var pos = require('pos');

var sentenceType = {
    interrogative: function (sentence) {
        //whQuestion or yesNo or other
        //aboutBot or aboutUser or other
        var data = {};
        data.noun = [];
        data.whQuestion = false;
        data.yesNo = false;
        data.aboutBot = false;
        data.aboutUser = false;
        var words = new pos.Lexer().lex(sentence);
        var tagger = new pos.Tagger();
        var taggedWords = tagger.tag(words);
        var index = 0;
        for (var i in taggedWords) {
            var taggedWord = taggedWords[i];
            var word = taggedWord[0].toLowerCase();
            var tag = taggedWord[1];
            //special case for i
            if (tag == 'PRP' || tag == 'PRP$' || word == 'i') {
                if (word == 'you' || word == 'your') {
                    data.aboutBot = true;
                }
                if (word == 'my' || word =='i') {
                    data.aboutUser = true;
                }
            }
            if (tag == 'WDT' || tag == 'WP$' || tag == 'WP' || tag == 'WRB') {
                data.whQuestion = true;
            }
            if ((index == 0) && (tag == 'VBZ' || tag == 'VBP')) {
                data.yesNo = true;
            }
            if (tag == 'NN' || tag == 'NNP' || tag == 'NNPS' || tag == 'NNS') {
                data.noun.push(word);
            }
            //console.log(word + " /" + tag);
            index ++;
        }
        return data;
    },
    assertive: function (sentence) {
        //aboutBot or aboutUser or other (fact)
        var data = {};
        data.noun = [];
        data.aboutBot = false;
        data.aboutUser = false;
        var words = new pos.Lexer().lex(sentence);
        var tagger = new pos.Tagger();
        var taggedWords = tagger.tag(words);
        for (var i in taggedWords) {
            var taggedWord = taggedWords[i];
            var word = taggedWord[0].toLowerCase();
            var tag = taggedWord[1];
            //special case for i
            if (tag == 'PRP' || tag == 'PRP$' || word == 'i') {
                if (word == 'you' || word == 'your') {
                    data.aboutBot = true;
                }
                if (word == 'my' || word == 'i') {
                    data.aboutUser = true;
                }
            }
            if ((tag == 'NN' && word != 'i') || tag == 'NNP' || tag == 'NNPS' || tag == 'NNS') {
                data.noun.push(word);
            }
            //console.log(word + " /" + tag);
        }
        return data;
    }
};
module.exports = sentenceType;