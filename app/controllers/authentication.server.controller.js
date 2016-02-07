var db = require('../../config/mongojs').db;
var config = require('../../config/config');
var request = require('request');
var qs = require('querystring');
var mongojs = require('mongojs');

function authorize(req, res) {
	var providerName = req.params.providerName;	

	if(providerName === "facebook") {
		__loginWithFacebook(req, res, providerName);
	}
}

function __loginWithFacebook(req, res, providerName) {
	var fields = ['id','name','birthday','gender', 'location'];
  	var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  	var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
	    code: req.body.code,
	    client_id: req.body.clientId,
	    client_secret: config.fb_secret,
	    redirect_uri: req.body.redirectUri
	};
    
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    	if (response.statusCode !== 200) {    		
    		console.log("error in connecting facebook:"+accessToken.error.message);
      		return res.status(500).send({ message: accessToken.error.message });
    	}

    	request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
    		if (response.statusCode !== 200) {
    			console.log("error in fetching facebook data:"+profile.error.message);
        		return res.status(500).send({ message: profile.error.message });
      		}
      		console.log("facebook authentication successful "+((profile) ? "and recived data" : "but not recived data"));
      		__shareUserData(res, {
  				socialID: profile.id,
  				gender: profile.gender,
  				location: profile.location,
  				picture: 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=small',
  				name: profile.name,
  				location: profile.location,
  				social: providerName,
  				token: accessToken,
  				birthday: profile.birthday,
  				savedRecipes: {}  				     			
  			});      		     	
    	});

    });
}

function __shareUserData(res, userObj) {
	
	db.userCollection.findOne({
		socialID: userObj.socialID
	}, function(err, result) {
		if(err) {
			console.log("error in saving new user record");
			res.status(500).send({ message: err });
		} else {
			var updateData = {		
				socialID: userObj.socialID,
				savedRecipes: [],
				social: userObj.social,
				name: userObj.name,
				location: userObj.location,
				gender: userObj.gender,
				birthday: userObj.birthday		
			};

			if(result && result.length > 0) {
				updateData._id = mongojs.ObjectId(result._id);					
			}

			db.userCollection.save(updateData, function(err, userResult) {
				if(err) {
					console.log("error in saving new user record");
					res.status(500).send({ message: err });
				} else {
					userObj.userID = userResult._id;

					var recipeId, savedRecipeLen = result.savedRecipes.length;
					if(savedRecipeLen > 0) {
						for(var index=0; index<savedRecipeLen; index++){
							recipeId = result.savedRecipes[index];

							(function(id, len, counter){
								db.recipeCollection.findOne({
									_id: mongojs.ObjectId(id)
								}, function(err, recipeResult){								
									if(err) {
										console.log("error in fetching full receipe of saved list");
										res.status(500).send({ message: err });
									} else {				
										userObj["savedRecipes"]["savedItems_"+recipeResult._id] = recipeResult;								

										if(counter === len-1) {
											console.log("saved recipe are fetched successfully");
											res.json(userObj);	
										}
									}
								});
							})(recipeId, savedRecipeLen, index);						
							
						}
					} else {
						res.json(userObj);	
					}					
				}
			});
		}
	});
}

function userLogout(req, res) {
	var userId = req.params.userId;

	db.userCollection.remove({
		_id: mongojs.ObjectId(userId)
	}, function(err, result) {
		if(err) {
			console.log("error in logging out user");
			res.status(500).send({ message: err });
		} else {
			res.json(true);	
		}
	});
}

module.exports = {
	authorize: authorize,
	userLogout: userLogout
};