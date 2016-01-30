var config = require('./config'),
    mongojs = require('mongojs');

var db = mongojs(config.db.name, config.db.collections);       

module.exports = {
	db: db
};