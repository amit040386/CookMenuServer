var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.use(express.static('public'));    
    app.set('view engine', 'jade');
    
    require('../app/routes/category.server.routes.js')(app);
    require('../app/routes/timing.server.routes.js')(app);
    require('../app/routes/recipe.server.routes.js')(app);
    require('../app/routes/origin.server.routes.js')(app);
    require('../app/routes/authentication.server.routes.js')(app);
    require('../app/routes/user.server.routes.js')(app);
    
    return app;
};