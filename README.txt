
Reference for adding a random string of alphanumeric characters with a node package:
https://github.com/klughammer/node-randomstring

To install randomstring, use npm:

npm install randomstring
Usage

var randomstring = require("randomstring");

randomstring.generate();
// >> "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT"

randomstring.generate(7);
// >> "xqm5wXX"

randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});
// >> "AqoTIzKurxJi"

randomstring.generate({
  charset: 'abc'
});