const utils = require("./libs/utils")
const time = require("./libs/time")

let now = Date.now() / 1000
let length = time.round(204.85012542322)

console.log(now, length, (now+length), time.round(now+length))