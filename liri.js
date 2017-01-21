"use strict";
var command = process.argv[2];
var input = process.argv.splice(3).join(' ');
var request = require('request');
console.log('------------------------------------------');

var myTweets = function(input) {

};

var spotifyThisSong = function(input) {

};

var movieThis = function(input) {
	var outputKeys = [
		'Title',
		'Year',
		'imdbRating',
		'Country',
		'Language',
		'Plot',
		'Actors',
		'tomatoRating',
		'tomatoURL'
	];

	var outputText = '';

	request('http://www.omdbapi.com/?r=json&plot=short&tomatoes=true&t='+ input, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var parsedJSON = JSON.parse(body, null, 2);
			for (var i = 0; i < outputKeys.length; i++) {
					outputText += outputKeys[i] + ': ' + parsedJSON[outputKeys[i]] + '\n';
			}
			console.log(outputText);
		}
	});
};

var doWhatItSays = function(input) {

};


switch (command) {
	case 'my-tweets':
		return myTweets();
	case 'spotify-this-song':
		return spotifyThisSong(input);
	case 'movie-this':
		return movieThis(input);
	case 'do-what-it-says':
		return doWhatItSays();
	default:
		return console.log(
			'The available commands are: \n * my-tweets \n * spotify-this-song [song name] \n * movie-this [movie name] \n * do-what-it-says'
		);
}
