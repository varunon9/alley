var pos = require('pos');
var stdin = process.openStdin();
var nlp = require('../app/nlp');

stdin.addListener('data', function (d) {
	var sentence = d.toString().trim();
	var words = new pos.Lexer().lex(sentence);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	for (i in taggedWords) {
	    var taggedWord = taggedWords[i];
	    var word = taggedWord[0];
	    var tag = taggedWord[1];
	    console.log(word + " /" + tag);
	}
    var data = nlp.parse(sentence);
    console.log(data);
});