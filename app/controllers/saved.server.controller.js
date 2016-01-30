var db = require('../../config/mongojs').db;

function getSavedRecipeList(req, res) {
	var cookId = req.params.cookId;

	db.savedRecipeCollection.find({
		cook: {
			id: cookId
		}
	}, function(err, result) {
		if(err) {
			console.log("Error in fetching data from savedRecipeCollection:"+err);
		} else {
			console.log("data fetched sucessfully from savedRecipeCollection");
		}
		res.json(result);
	});
}

module.exports = {
	getSavedRecipeList: getSavedRecipeList
};