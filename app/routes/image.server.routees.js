var imageController = require("../../app/controllers/image.server.controller.js");

module.exports = function(app) {
	app.get('/getRecipeImage/:imageName', imageController.getRecipeImage);	
};