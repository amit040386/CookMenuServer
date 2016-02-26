var db = require('../../config/mongojs').db;
var _ = require("underscore");
var mongojs = require('mongojs');
var jade = require('jade');
var config = require('../../config/config');

function getAllRecipeList(req, res) {
	db.recipeCollection.find(function(err, result) {
		__successCallback(res, result, err, 'recipeCollection for all');
	});
}

function getAllRecipeByCategory(req, res) {
	var categoryName = req.params.categoryName, pageNum = +req.params.pageNum, maxCount = +req.params.maxCount;

	if(categoryName) { 
		db.recipeCollection.find({
			category: {
				$elemMatch: {
					$eq: categoryName
				}
			}		
		})
		.skip(maxCount * pageNum)
		.limit(maxCount, function(err, result) {					
			__successCallback(res, result, err, 'recipeCollection by category');
		});	
	} else {
		__successCallback(res, []);
	}		
}

function getAllRecipeByTiming(req, res) {
	var timingVal = req.params.timing, pageNum = +req.params.pageNum, maxCount = +req.params.maxCount;

	if(timingVal) {
		db.recipeCollection.find({
			time: timingVal
		})
		.skip(maxCount * pageNum)
		.limit(maxCount, function(err, result)  {
			__successCallback(res, result, err, 'recipeCollection by timing');
		});
	} else {
		__successCallback(res, []);
	}	
}

function getAllRecipeByOrigin(req, res) {
	var originVal = req.params.originName, pageNum = +req.params.pageNum, maxCount = +req.params.maxCount;

	if(originVal) {
		db.recipeCollection.find({
			origin: originVal
		})
		.skip(maxCount * pageNum)
		.limit(maxCount, function(err, result)  {
			__successCallback(res, result, err, 'recipeCollection by timing');
		});
	} else {
		__successCallback(res, []);
	}	
}

function getAllSpecialRecipeList(req, res) {
	db.recipeCollection.find({
		isSpecial: true
	}, function(err, result)  {
		__successCallback(res, result, err, 'recipeCollection by special');
	});
}

function getAllRecipeByName(req, res) {
	if(req.params.recipeName && req.params.recipeName != "") {
		
		var arrOfKeywords = [], keywords = req.params.recipeName.split(" "), pageNum = +req.params.pageNum, maxCount = +req.params.maxCount;

		for(var index=0, len=keywords.length; index<len; index++) {
			arrOfKeywords.push(new RegExp(keywords[index],'i'));
		}

		db.recipeCollection.find({		
			title: {
				$in: arrOfKeywords
			}
		})
		.skip(maxCount * pageNum)
		.limit(maxCount, function(err, result)  {
			__successCallback(res, result, err, 'recipeCollection by name');
		});
	} else {
		__successCallback(res, []);
	}	
}

function getAllRandomRecipe(req, res) {
	var randomCategoryName, recipeCount = +req.params.recipeCount, categoryCount = +req.params.categoryCount;

	if(recipeCount && categoryCount) {
		db.categoryCollection.find({}, function(err, result) {
			__logger(err, 'categoryCollection by random');
			
			if(result && result.length > 0) {
				var arr = [], randomCategories = _.sample(result, categoryCount);			

				for(var index=0, len=randomCategories.length; index<len; index++) {
					randomCategoryName = randomCategories[index].category;

					(function(name) {						

						db.recipeCollection.find({
							category: {
								$elemMatch: {
									$eq: name
								}
							}	
						}).sort({
							recommended: -1
						}).limit(recipeCount, function(recipeErr, data) {
							arr.push({
								categoryName: name,
								recipes: data
							});							
							__logger(recipeErr, 'recipeCollection by random for category:'+name+"; data="+data.length);

							if(arr.length === categoryCount) {
								console.log("data completed and ready to give response");
								__successCallback(res, arr);
							}
						});											
					})(randomCategoryName);					

				}
			}
			
		});
	} else {
		__successCallback(res, []);
	}	
}

function getAllCreatedRecipeByCook(req, res) {
	var cookId = req.params.cookId;
console.log("cook id"+cookId);
	if(cookId) {
		db.recipeCollection.find({
			"cook.id": cookId			
		}, function(err, result) {
			__successCallback(res, result, err, 'recipeCollection by creater');
		});
	} else {
		__successCallback(res, []);
	}
}

function setFavoriteRecipeInBulk (req, res) {
	var userId = req.params.userId, data = req.body.data;

	if(userId && data) {
		db.userCollection.findAndModify({
			query:{
				_id: mongojs.ObjectId(userId)
			},
			update: {
				$addToSet: {
					savedRecipes: {
						 $each: data
					}
				}
			}
		}, function(err, result){
			if(err) {
				__logger(err, "userCollection for adding favorite recipes");
				res.status(500).send({ message: err });
			} else {
				res.json(true);
			}
		});
	}
}

function recommendRecipe(req, res) {
	var recipeId = req.params.recipeId;

	if(recipeId) {
		db.recipeCollection.findAndModify({
			query:{
				_id: mongojs.ObjectId(recipeId)
			},
			update: {
				$inc: {
					recommended: 1
				}
			}
		}, function(err, result){
			if(err) {
				__logger(err, "userCollection for recommending recipe");
				res.status(500).send({ message: err });
			} else {
				res.json(true);
			}
		});
	}
}

function submitComment(req, res) {
	var cookId = req.body.userID, name = req.body.name, recipeId = req.body.recipeID, comment = req.body.comment;

	if(cookId && name && recipeId && comment) {
		db.recipeCollection.findAndModify({
			query:{
				_id: mongojs.ObjectId(recipeId)
			},
			update: {
				$addToSet: {
					comments: {
						"cook": {
							"id": cookId,
							"name": name							
						},				
						"time": new Date().getTime(),		
						"comment": [comment]
					}
				}
			}
		}, function(err, result){
			if(err) {
				__logger(err, "recipeCollection for sbmitting comment");
				res.status(500).send({ message: err });
			} else {
				res.json(true);
			}
		});
	}
}

function deleteComment(req, res) {
	var recipeId = req.body.recipeId, time = +req.body.time;	
	
	if(recipeId && time) {
		db.recipeCollection.findAndModify({
			query:{
				_id: mongojs.ObjectId(recipeId)
			},
			update: {
				$pull: {
					comments: {						
						time: time						
					}
				}
			}
		}, function(err, result){
			if(err) {
				__logger(err, "recipeCollection for deleting comment");
				res.status(500).send({ message: err });
			} else {
				res.json(true);
			}
		});
	}
}

function shareRecipeInSocialMedia(req, res) {
	var recipeId = req.params.recipeId;

	if(recipeId) {
		db.recipeCollection.findOne({
			_id: mongojs.ObjectId(recipeId)
		}, function(err, result){
			if(err) {
				__logger(err, "recipeCollection for fetching recipe html for social media sharing");
				res.status(500).send({ message: err });
			} else {
				result.appLink = config.appLink;
				result.media = config.imagePath+result.media;
				res.render('recipe', result);
			}
		});		
	}
}

function submitRecipe(req, res) {
	var data = req.body;

	if(data && data.name && data.shortNote && data.origin.length > 0 && data.timing.length > 0 && data.category.length > 0 && data.ingredients.length > 0 && data.fullDescription.length > 0 && data.cook && data.cook.id && data.cook.name) {
		
		db.recipeCollection.insert({
			"title": data.name,
			"media": (data.media) ? data.media : config.defaultImage,
			"description": data.shortNote,
			"recipe": {
				"ingradient": data.ingredients,
				"full_description": data.fullDescription.join("\n\n")
			},
			"origin": data.origin[0],
			"category": data.category,
			"time": data.timing[0],
			"isSpecial": false,
			"cook": {
				"id": data.cook.id,
				"name": data.cook.name,
				"city": ""
			},
			"recommended": 0,
			"comments": []
		}, function(err, result){
			if(err) {
				__logger(err, "recipeCollection for submitting new recipe");
				res.status(500).send({ message: err });
			} else {
				res.json(result);
			}
		});
	}
}

function __successCallback(res, result, err, collectionName) {	
	if(err) {
		__logger(err, collectionName);		
		res.status(500).send({ message: err });
	} else {
		console.log("result set count:"+result.length);
		res.json(result || []);	
	}	
}

function __logger(err, collectionName) {
	collectionName  = ((collectionName) ? collectionName : "");
	if(err) {
		console.log("Error in fetching data from "+collectionName+":"+err);
	} else {
		console.log("data fetched sucessfully from "+collectionName);
	}
}

module.exports = {
	getAllRecipeList: getAllRecipeList,
	getAllRecipeByCategory: getAllRecipeByCategory,
	getAllRecipeByTiming: getAllRecipeByTiming,
	getAllRecipeByOrigin: getAllRecipeByOrigin,
	getAllSpecialRecipeList: getAllSpecialRecipeList,
	getAllRecipeByName: getAllRecipeByName,
	getAllRandomRecipe: getAllRandomRecipe,
	getAllCreatedRecipeByCook: getAllCreatedRecipeByCook,
	setFavoriteRecipeInBulk: setFavoriteRecipeInBulk,
	recommendRecipe: recommendRecipe,
	submitComment: submitComment,
	deleteComment: deleteComment,
	shareRecipeInSocialMedia: shareRecipeInSocialMedia,
	submitRecipe: submitRecipe
};