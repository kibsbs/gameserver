const app = require("express")()
let moment = require("moment")
app.get('/', (req, res) => {
    res.send("" + moment().local().valueOf() / 1000);
});

app.listen(5000)