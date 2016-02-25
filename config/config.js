var port = 3000;
module.exports = {
    port: port,
    fb_secret: "8f10e48c79888c7a0a3b73708e3bd853",    	
    imagePath: "../images/",
    defaultImage: "Fish-curry",
    appLink: "https://play.google.com/store/apps?hl=en",
    db: {
    	name: "cookMenuDB",    	
    	collections: ['menuCollection','categoryCollection','timingCollection','recipeCollection','originCollection','userCollection']
    }
};