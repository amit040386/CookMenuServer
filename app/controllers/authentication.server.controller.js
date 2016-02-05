var db = require('../../config/mongojs').db;
var config = require('../../config/config');
var request = require('request');
var qs = require('querystring');

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
      		console.log("facebook authentication successful "+((profile) ? "and recived data" : "but not recived data")+JSON.stringify(profile));
      		__shareUserData(res, {
  				userId: profile.id,
  				gender: profile.gender,
  				location: profile.location,
  				picture: 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=small',
  				name: profile.name,
  				location: profile.location,
  				social: providerName,
  				token: accessToken      				
  			});      		     	
    	});

    });
}

function __shareUserData(res, userObj) {
	res.json(userObj); 
}

module.exports = {
	authorize: authorize
};