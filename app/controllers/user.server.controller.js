var db = require('../../config/mongojs').db;
var mongojs = require('mongojs');

function setFavoriteRecipe(req, res) {
	var userId = req.params.userId, recipeId = req.params.recipeId;

	db.recipeCollection.findOne({
		_id: mongojs.ObjectId(recipeId)
	}, function(err, result) {
		if(err) {
			console.log("error in fetching recipe by id. either wrong id given or somthing else");
		} else {
			db.userCollection.findAndModify({
				query:{
					_id: mongojs.ObjectId(userId)
				},
				update: {
					$addToSet: {
						savedRecipes: recipeId
					}
				}
			}, function(err, updateResult){
				if(err) {
					res.status(500).send({ message: err });
					console.log("error in updating as favorites");
				} else {
					res.json(result);
				}
			});
		}
	});
}

function removeFavoriteRecipe(req, res) {
	var userId = req.params.userId, recipeId = req.params.recipeId;
	
	db.userCollection.findAndModify({
		query: {
			_id: mongojs.ObjectId(userId)
		},
		update: {
			$pull: {
				savedRecipes: recipeId
			}
		}
	}, function(err, result) {
		if(err) {
			console.log("error in removing recipe from user favorite list");
			res.status(500).send({ message: err });
		} else {
			res.json(true);
		}
	});	
}

module.exports = {
	setFavoriteRecipe: setFavoriteRecipe,
	removeFavoriteRecipe: removeFavoriteRecipe
};