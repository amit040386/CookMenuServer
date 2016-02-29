var config = require('./config'), 
	dbName,
    mongojs = require('mongojs');

if(process.env.OPENSHIFT_MONGODB_DB_URL) {
	dbName = process.env.OPENSHIFT_MONGODB_DB_URL+config.db.name;
} else {
	dbName = config.db.name;
}

var db = mongojs(dbName, config.db.collections);       

module.exports = {
	db: db
};