var express = require('express');
var app = express();

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 8080, function () {
    console.log('Example app listening on port 8080!');
});
