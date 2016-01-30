var express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    
    });

    app.use(express.static('public'));
    
    require('../app/routes/category.server.routes.js')(app);
    require('../app/routes/timing.server.routes.js')(app);
    require('../app/routes/recipe.server.routes.js')(app);
    require('../app/routes/origin.server.routes.js')(app);
    require('../app/routes/saved.server.routes.js')(app);    
    
    return app;
};