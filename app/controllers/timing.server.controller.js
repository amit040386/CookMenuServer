var db = require('../../config/mongojs').db;

function getAllTimingList(req, res) {
	db.timingCollection.find(function(err, result) {
		if(err) {
			console.log("Error in fetching data from timingCollection:"+err);
		} else {
			console.log("data fetched sucessfully from timingCollection");
		}
		res.json(result);
	});
}

module.exports = {
	getAllTimingList: getAllTimingList
};