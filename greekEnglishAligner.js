var natural = require('natural');
var XRegExp = require('xregexp');
var corpusFaker = require('./src/corpusFaker.js');
var wordAligner = require('./src/wordAligner.js');

var nonUnicodeLetter = XRegExp('\\PL');
var tokenizer = new natural.RegexpTokenizer({pattern: nonUnicodeLetter});

function lineArray(filename) {
  var array = []; // response
  require('fs').readFileSync(filename).toString().split(/\r?\n/).forEach(function(line){
    array.push(line);
  });
  return array;
}

function normalizePolytonicGreek(text) {
  text = text.normalize('NFKC')
    .replace(/Ά|Α|ά|ἀ|ἁ|ἂ|ἃ|ἄ|ἅ|ἆ|ἇ|ὰ|ά|ᾀ|ᾁ|ᾂ|ᾃ|ᾄ|ᾅ|ᾆ|ᾇ|ᾰ|ᾱ|ᾲ|ᾳ|ᾴ|ᾶ|ᾷ|Ἀ|Ἁ|Ἂ|Ἃ|Ἄ|Ἅ|Ἆ|Ἇ|ᾈ|ᾉ|ᾊ|ᾋ|ᾌ|ᾍ|ᾎ|ᾏ|Ᾰ|Ᾱ|Ὰ|Ά|ᾼ/g,'α')
    .replace(/Έ|Ε|έ|ἐ|ἑ|ἒ|ἓ|ἔ|ἕ|ὲ|έ|Ἐ|Ἑ|Ἒ|Ἓ|Ἔ|Ἕ|Ὲ|Έ/g,'ε')
    .replace(/Ή|Η|ή|ἠ|ἡ|ἢ|ἣ|ἤ|ἥ|ἦ|ἧ|ὴ|ή|ᾐ|ᾑ|ᾒ|ᾓ|ᾔ|ᾕ|ᾖ|ᾗ|ῂ|ῃ|ῄ|ῆ|ῇ|Ἠ|Ἡ|Ἢ|Ἣ|Ἤ|Ἥ|Ἦ|Ἧ|ᾘ|ᾙ|ᾚ|ᾛ|ᾜ|ᾝ|ᾞ|ᾟ|Ὴ|Ή|ῌ/g,'η')
    .replace(/Ί|Ϊ|Ι|ί|ΐ|ἰ|ἱ|ἲ|ἳ|ἴ|ἵ|ἶ|ἷ|ὶ|ί|ῐ|ῑ|ῒ|ΐ|ῖ|ῗ|Ἰ|Ἱ|Ἲ|Ἳ|Ἴ|Ἵ|Ἶ|Ἷ|Ῐ|Ῑ|Ὶ|Ί/g,'ι')
    .replace(/Ό|Ο|ό|ὀ|ὁ|ὂ|ὃ|ὄ|ὅ|ὸ|ό|Ὀ|Ὁ|Ὂ|Ὃ|Ὄ|Ὅ|Ὸ|Ό/g,'ο')
    .replace(/Ύ|Ϋ|Υ|ΰ|ϋ|ύ|ὐ|ὑ|ὒ|ὓ|ὔ|ὕ|ὖ|ὗ|ὺ|ύ|ῠ|ῡ|ῢ|ΰ|ῦ|ῧ|Ὑ|Ὓ|Ὕ|Ὗ|Ῠ|Ῡ|Ὺ|Ύ/g,'υ')
    .replace(/Ώ|Ω|ώ|ὠ|ὡ|ὢ|ὣ|ὤ|ὥ|ὦ|ὧ|ὼ|ώ|ᾠ|ᾡ|ᾢ|ᾣ|ᾤ|ᾥ|ᾦ|ᾧ|ῲ|ῳ|ῴ|ῶ|ῷ|Ὠ|Ὡ|Ὢ|Ὣ|Ὤ|Ὥ|Ὦ|Ὧ|ᾨ|ᾩ|ᾪ|ᾫ|ᾬ|ᾭ|ᾮ|ᾯ|Ὼ|Ώ|ῼ/g,'ω')
    .replace(/ῤ|ῥ|Ῥ/g,'ρ')
    .replace(/Σ|ς/g,'σ');
  return text;
}

console.time('corpus');
var greekArray = lineArray('./tests/fixtures/greekToEnglish/greek.txt');
var englishArray = lineArray('./tests/fixtures/greekToEnglish/english.txt');
var corpus = [];
greekArray.forEach(function(greekString, index) {
  var englishString = englishArray[index];
  corpus[index] = [normalizePolytonicGreek(greekString).toLowerCase(), englishString.toLowerCase()];
});
greekArray = [];
englishArray = [];
console.timeEnd('corpus');

console.time('table');
var table = wordAligner.tableGenerate(corpus);
// console.log("\n\n\tTable:\n\n", table);
console.timeEnd('table');

console.time('alignment');
var alignmentPairs = corpus.slice(0).splice(1,10)
alignmentPairs.forEach(function(alignmentPair) {
  console.log("\n\n\tSource: ", alignmentPair[0]);
  console.log("\n\tTarget: ", alignmentPair[1]);
  var alignment = wordAligner.align(alignmentPair, table);
  console.log("\n\tAlignment:\n", alignment);
});
console.timeEnd('alignment');
