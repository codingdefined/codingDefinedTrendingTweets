// Author Coding Defined

var https = require('https');
var headers = {
	'User-Agent': 'Coding Defined',
	Authorization: 'Bearer ' + require('./oauth.json').access_token
};

function callTwitter(options, callback){
	https.get(options, function(response) {
		jsonHandler(response, callback);
	}).on('error', function(e) {
		console.log('Error : ' + e.message);
	})
}

var trendOptions = {
	host: 'api.twitter.com',
	path: '/1.1/trends/place.json?id=1', // id = 1 for global trends
	headers: headers
}

var tweetDetails = {
	maxresults: 10,
	resultType: 'recent', // options are mixed, popular and recent
	options: {
		host: 'api.twitter.com',
		headers: headers,
	}
}

function jsonHandler(response, callback) {
	var json = '';
	response.setEncoding('utf8');
	if(response.statusCode === 200) {
		response.on('data', function(chunk) {
			json += chunk;
		}).on('end', function() {
			callback(JSON.parse(json));
		});
	} else {
		console.log('Error : ' + reseponse.statusCode);
	}
}

function fullTweetPath(query) {
	var path = '/1.1/search/tweets.json?q=' + query
	+ '&count=' + tweetDetails.maxResult
	+ '&include_entities=true&result_type=' + tweetDetails.resultType;

	tweetDetails.options.path = path; 
}

callTwitter(trendOptions, function(trendsArray) {
	fullTweetPath(trendsArray[0].trends.query)
	callTwitter(tweetDetails.options, function(tweetObj) {
		tweetObj.statuses.forEach(function(tweet) {
			console.log('\n' + tweet.user.screen_name + ' : ' + tweet.text);
		})
	})
});
