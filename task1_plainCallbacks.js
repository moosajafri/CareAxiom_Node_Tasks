var express = require('express');
var request = require("request");
var app = express();
var r_url;
var myTitles;

//This is the only route served by the app, all other routes are directed to a 404 not found!. 
app.get('/I/want/title', function(req, res) {
	var my_params = req.param('address');
	var i;
	var inserted = 0;
	var WriteResponse = function WriteResponse(myTitles) {
		var response = "<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>" + myTitles + "</ul></body></html>";
		res.send(response);
	}
	var getTitles = function getTitles() {
		//To convert string into array. Since in the case of a single argument, it returns a string instead of an array.
		if (typeof my_params === 'string') {
			my_params = [my_params];
		}
		myTitles = '';
		for (i = 0; i < my_params.length; i++) {
			r_url = my_params[i];
			request(r_url, function(error, response, body) {
				if (error) {
					//error handling, if url is not valid or doesnt return a valid response, an error message is displayed instead.
					myTitles = myTitles + '<li>' + r_url + ' - ' + error;
				} else {
					//This is the regular expression that matches any thing in betwwen the <title></title> tags from the returned body of the website
					var title = body.match(/<title[^>]*>([^<]+)<\/title>/)[1];
					myTitles = myTitles + '<li> ' + r_url + ' - ' + title + '</li>';
				}
				if (++inserted == my_params.length) {
					WriteResponse(myTitles);
				}
			});
		}
	}
	getTitles();
});

//return 404 not found for all other urls
app.get('*', function(req, res) {
	res.status(404);
	res.send('<h1>Oops, Page Not Found</h1>');
})
app.listen(8081);