var recipeController = require("../../app/controllers/recipe.server.controller.js");

module.exports = function(app) {
	app.get('/getAllRecipe', recipeController.getAllRecipeList);
	app.get('/getAllSpecialRecipe', recipeController.getAllSpecialRecipeList);

	app.get('/getAllRecipeBy/category/:categoryName/:pageNum/:maxCount', recipeController.getAllRecipeByCategory);
	app.get('/getAllRecipeBy/timing/:timing/:pageNum/:maxCount', recipeController.getAllRecipeByTiming);
	app.get('/getAllRecipeBy/origin/:originName/:pageNum/:maxCount', recipeController.getAllRecipeByOrigin);	
	app.get('/getAllRecipeBy/name/:recipeName/:pageNum/:maxCount', recipeController.getAllRecipeByName);
	app.get('/getAllRecipeBy/random/:categoryCount/:recipeCount', recipeController.getAllRandomRecipe);	

	app.get('/getAllCreatedRecipeBy/cook/:cookId', recipeController.getAllCreatedRecipeByCook);
	app.post('/setFavoriteRecipeInBulk/:userId', recipeController.setFavoriteRecipeInBulk);
	app.get('/recommendRecipe/:recipeId', recipeController.recommendRecipe);
	app.post('/submitComment', recipeController.submitComment);
	app.post('/deleteComment', recipeController.deleteComment);
};