var authController = require("../../app/controllers/authentication.server.controller.js");

module.exports = function(app) {
	app.post('/auth/:providerName', authController.authorize);	
};