var port = 3000;
module.exports = {
    port: port,
    fb_secret: "8f10e48c79888c7a0a3b73708e3bd853",    	
    db: {
    	name: "cookMenuDB",    	
    	collections: ['menuCollection','categoryCollection','timingCollection','recipeCollection','originCollection','userCollection']
    }
};