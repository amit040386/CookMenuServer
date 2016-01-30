var savedRecipeController = require("../../app/controllers/saved.server.controller.js");

module.exports = function(app) {
	app.get('/getSavedRecipe/:cookId', savedRecipeController.getSavedRecipeList);	
};