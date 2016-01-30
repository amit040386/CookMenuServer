var timingController = require("../../app/controllers/timing.server.controller.js");

module.exports = function(app) {
	app.get('/getAllTiming', timingController.getAllTimingList);
};