var originController = require("../../app/controllers/origin.server.controller.js");

module.exports = function(app) {
	app.get('/getAllOrigin', originController.getAllOriginList);
};