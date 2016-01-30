var port = 3000;

module.exports = {
    port: port,
    db: {
    	name: "cookMenuDB",    	
    	collections: ['menuCollection','categoryCollection','timingCollection','recipeCollection','originCollection']
    }
};