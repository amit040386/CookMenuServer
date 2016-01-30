var config = require('./config/config'),
    express = require('./config/express');

var app = express();

app.listen(config.port);

module.exports = app;
console.log('development server running at http://localhost:' + config.port);