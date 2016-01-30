var categoryController = require("../../app/controllers/category.server.controller.js");

module.exports = function(app) {
	app.get('/getAllCategory', categoryController.getAllCategoryList);
};