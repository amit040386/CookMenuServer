var config = require('./config/config'),
    express = require('./config/express');

var app = express();

app.set('port', (process.env.PORT || config.port));

app.listen(app.get('port'));

module.exports = app;
console.log('development server running at http://localhost:' + app.get('port'));