var config = require('./config/config'),
    express = require('./config/express');

var app = express();

app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || config.port));
var serverIPAddr = (process.env.OPENSHIFT_NODEJS_IP || 'localhost');

app.listen(app.get('port'), serverIPAddr, function(){
	console.log('development server listening at http://'+serverIPAddr+':' + app.get('port'));	
});

module.exports = app;
console.log('development server running at http://'+serverIPAddr+':' + app.get('port'));