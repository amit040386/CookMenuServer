var userController = require("../../app/controllers/user.server.controller.js");

module.exports = function(app) {
	app.get('/setFavoriteRecipe/:userId/:recipeId', userController.setFavoriteRecipe);
	app.get('/removeFavoriteRecipe/:userId/:recipeId', userController.removeFavoriteRecipe);	
};