var express = require('express');
var request = require("request");
var async = require("async");
var app = express();
var q = require('q');
var fs = require('fs');

app.get('/I/want/title', function(req, res) {
	var myTitles = '';
	var callback = function callback(deferred) {
		console.log('i am a plain callback function with no purpose in life! ');
		return deferred.promise;
	}

	var mycallback = function(body) {
		//This is the regular expression that matches any thing in betwwen the <title></title> tags from the returned body of the website
		var title = body.match(/<title[^>]*>([^<]+)<\/title>/)[1];
		console.log('request from ' + myUrl + ' returned title : ' + title);
		myTitles = myTitles + '<li>' + myUrl + ' - ' + title + '</li>';
		console.log('myTitles is now ' + myTitles);

	}
	var getTitle = function getTitle(myUrl, mycallback) {
		var deferred = q.defer();
		request(myUrl, function(error, response, body) {
			if (error) {
				deferred.reject(err);
			} else {
				deferred.resolve(body);
			}

		});
	}

	var returnResponse = function returnResponse(myTitles) {
		//res.send('i am done here!');
		console.log('finally done!!');
		console.log(myTitles);
	}
	var my_params = req.param('address');
	//To convert string into array. Since in the case of a single argument, it returns a string instead of an array.
	if (typeof my_params === 'string') {
		my_params = [my_params];
	}
	var allPromise = q.all([getTitle('http://youtube.com'), getTitle('http://facebook.com')])
	allPromise.then(returnResponse);
});
app.listen(8081);