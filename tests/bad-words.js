var Filter = require('bad-words')
var filter = new Filter({ regex: /\*|\.|$/gi });
console.log(filter.isProfane("ANALSEX"))