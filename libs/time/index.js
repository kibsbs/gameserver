var offset = 0;
var locked = null;

function milliseconds() {
    return locked || Date.now() + offset;
}

function seconds() {
    return Math.floor(milliseconds() / 1000);
}

function secondsDouble() {
    return (milliseconds() / 1000);
}

function day() {
    return new Date(milliseconds()).getUTCDay();
}

function hours() {
    return new Date(milliseconds()).getUTCHours();
}

function minutes() {
    return new Date(milliseconds()).getUTCMinutes();
}

function round(time) {
    return Math.round(time * 1000) / 1000
}

module.exports = {
    milliseconds,
    seconds,
    secondsDouble,
    day,
    hours,
    minutes,
    round
};