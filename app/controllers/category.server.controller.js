var db = require('../../config/mongojs').db;

function getAllCategoryList(req, res) {
	db.categoryCollection.find(function(err, result) {
		if(err) {
			console.log("Error in fetching data from categoryCollection:"+err);
		} else {
			console.log("data fetched sucessfully from categoryCollection");
		}
		res.json(result);
	});
}

module.exports = {
	getAllCategoryList: getAllCategoryList
};