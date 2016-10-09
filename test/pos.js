var pos = require('pos');
var words = new pos.Lexer().lex('This is some sample text. This text can contain multiple sentences.');
var tagger = new pos.Tagger();
var taggedWords = tagger.tag(words);
for (i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];
    console.log(word + " /" + tag);
}
/*
    CC Coord Conjuncn           and,but,or
    CD Cardinal number          one,two
    DT Determiner               the,some
    EX Existential there        there
    FW Foreign Word             mon dieu
    IN Preposition              of,in,by
    JJ Adjective                big
    JJR Adj., comparative       bigger
    JJS Adj., superlative       biggest
    LS List item marker         1,One
    MD Modal                    can,should
    NN Noun, sing. or mass      dog
    NNP Proper noun, sing.      Edinburgh
    NNPS Proper noun, plural    Smiths
    NNS Noun, plural            dogs
    POS Possessive ending       �s
    PDT Predeterminer           all, both
    PP$ Possessive pronoun      my,one�s
    PRP Personal pronoun         I,you,she
    RB Adverb                   quickly
    RBR Adverb, comparative     faster
    RBS Adverb, superlative     fastest
    RP Particle                 up,off
    SYM Symbol                  +,%,&
    TO �to�                     to
    UH Interjection             oh, oops
    VB verb, base form          eat
    VBD verb, past tense        ate
    VBG verb, gerund            eating
    VBN verb, past part         eaten
    VBP Verb, present           eat
    VBZ Verb, present           eats
    WDT Wh-determiner           which,that
    WP Wh pronoun               who,what
    WP$ Possessive-Wh           whose
    WRB Wh-adverb               how,where
    , Comma                     ,
    . Sent-final punct          . ! ?
    : Mid-sent punct.           : ; �
    $ Dollar sign               $
    # Pound sign                #
    " quote                     "
    ( Left paren                (
    ) Right paren               )
*/
/*
    Here are some examples of yes/no interrogative sentences:

    Mister, can you spare a dime?
    Did you take your vitamin this morning?
    Do you have your homework ready?
    Are you ready to go?
    Did you go to the game Friday night?
    Are they nice?
    Are they visiting Paris?
    Has she done the housework?
    Has Nancy been working all night long?
    Will he be reading the book?
    Do you like apples?
    Do they go to a high school?
    Does Nancy read a lot?
    Does he hate basketball?
    Did he discover the truth?
    Did they do the homework?
    ---------------------------------

    Examples of alternative interrogative sentences:

    Would you prefer chocolate or vanilla ice cream?
    Should I call or email you?
    Do you want coffee, tea, or soda?
    -----------------------------------
    Examples of wh-interrogative sentences:

    What are you doing?
    Where do you live?
    Who is playing in the Super Bowl?
    What is the meaning of this?
    Which songs do you like best?
    --------------------------------------
    Tag questions are questions attached or tagged onto the ending of a declarative statement.  
    They transform a declarative sentence into an interrogative sentence.

    Examples:

    You live in the city, don’t you?
    We need to get going now, don’t we?
    There’s a game on today, isn’t there?
    You’re coming to the party, aren’t you?
    --------------------------------------------
    Form: Do/does + subject + present tense form of the verb.
    Examples are given below:
    The cow eats grass. (Assertive)
    Does the cow eat grass? (Interrogative)
    Alice sings a song. (Assertive)
    Does Alice sing a song? (Interrogative)
    She gets up early in the morning. (Assertive)
    Does she get up early in the morning? (Interrogative)
    I work hard. (Assertive)
    Do I work hard? (Interrogative)
    She speaks English well. (Assertive)
    Does she speak English well? (Interrogative)
    Note that if the interrogative sentence is in the negative, we begin it with do not or does not.
    Don’t you want to come with us?
    Doesn’t she understand what he means?
    The question words who, whom, whose, when, why, where, which, how etc., sometimes precede do and does.
    Whom do you want to meet?
    Why do you want to go there?
    Where does he live?
    How do you know him?
    Who does not love his country?
    When the affirmative sentence contains the primary auxiliaries is, am, are, has or have, the interrogative sentence will begin with these words.
    She is a doctor. (Affirmative)
    Is she a doctor? (Interrogative)
    They have a car. (Affirmative)
    Have they a car? OR Do they have a car? (Interrogative)
    She is very clever. (Affirmative)
    Is she very clear? (Interrogative)
    She has many friends. (Affirmative)
    Has she many friends. OR Does she have many friends? (Interrogative)
    When the affirmative sentence contains the auxiliaries can, may, will, shall etc, the interrogative sentence will begin with these words.
    She can go.
    Can she go?
    They will come.
    Will they come?
    You may take this book.
    May I take this book?
    I can lift this load?
    Can you lift this load?
    We must go there.
    Must we go there?
    ----------------------------------------
*/