var db = require('../../config/mongojs').db;

function getAllOriginList(req, res) {
	db.originCollection.find(function(err, result) {
		if(err) {
			console.log("Error in fetching data from originCollection:"+err);
		} else {
			console.log("data fetched sucessfully from originCollection");
		}
		res.json(result);
	});
}

module.exports = {
	getAllOriginList: getAllOriginList
};