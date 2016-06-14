//required modules
var express = require('express');
var request = require("request");
var async = require("async");
var app = express();

//This is the only route served by the app, all other routes are directed to a 404 not found!. 
app.get('/I/want/title', function(req, res) {
    var my_params = req.param('address');

    //To convert string into array. Since in the case of a single argument, it returns a string instead of an array.
    if (typeof my_params === 'string') {
        my_params = [my_params];
    }
    var myTitles = '';

    //This is the function to be executed once all the titles of required websites have been fetched! 
    var WriteResponse = function WriteResponse() {
        var response = "<html><head></head><body><h1> Following are the titles of given websites: </h1><ul>" + myTitles + "</ul></body></html>";
        res.send(response);
    }

    //This is the call back function foreach entry in the my_params array.This array contains all the required URLS whose titles are to be fetched.
    var callback = function callback() {
        console.log('i am a plain callback function with no purpose in life! ');
    }

    /*This is the async modules foreach method.It takes three arguments, first is the collection(an array in our case),
    second is the call back function to be called for each individual element in the collection, and third is the final call back
    function to be called when all the above call backs return. forEach is by default parallel in nature. Here, I have used the forEachSeries
    just to preserve the order of websites requested. async.forEach() just works fine too */

    async.forEachSeries(my_params, function(myUrl, callback) {
        console.log('request to ' + myUrl + ' being made');
        request(myUrl, function(error, response, body) {
            if (error) {
                //error handling, if url is not valid or doesnt return a valid response, an error message is displayed instead.
                myTitles = myTitles + '<li>' + myUrl + ' - ' + error;
            } else {
                //This is the regular expression that matches any thing in betwwen the <title></title> tags from the returned body of the website
                var title = body.match(/<title[^>]*>([^<]+)<\/title>/)[1];
                myTitles = myTitles + '<li>' + myUrl + ' - ' + title + '</li>';
                
            }
            callback();
        });

    }, function(err) {
        if (err) return next(err);
        WriteResponse();
    });
});

//return 404 not found for all other urls
app.get('*', function(req, res) {
    res.status(404);
    res.send('<h1>Oops, Page Not Found</h1>');
})
app.listen(8081);