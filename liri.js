"use strict";
var request = require('request');
var fs = require('fs');
var spotify = require('spotify');

var requestHelper = function (URL, callback) {
	request(URL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body));
		} else throw error;
	});
};

var myTweets = function(input) {
	var tweetCount = input ? input : 20;
	console.log('Tweets my lord');
};

var concatenateStrings = function(array, data) {
	var outputText = '';
	for (var i = 0; i < array.length; i++) {
		outputText += (array[i] + ': ' + data[array[i]] + '\n');
	}
	return outputText;
};

var spotifyThisSong = function(input) {
	var searchTerm = input ? input : 'The Sign';
	var outputKeys = [
		''
	];
	spotify.search({
		type: 'track',
		query: searchTerm,
		// limit: 1
	}, function (error, data) {
		if (error) throw error;
		else {
			console.log(data)
			// console.log(concatenateStrings(outputKeys, data));
		}
	});
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
	var searchTerm = input ? input : 'Mr. Nobody';
	console.log(searchTerm);

	requestHelper((
		'http://www.omdbapi.com/?' + 
		'r=json' +
		'&plot=short' +
		'&tomatoes=true' +
		'&t=' + searchTerm
	),
	function(data) {
		console.log(concatenateStrings(outputKeys, data));
	});
};

var doWhatItSays = function(input) {
	fs.readFile('random.txt', 'utf8', function (error, data) {
		if (error) throw error;
		else {
			commandHandler.apply(this, data.trim().split(','));
		} 
	});
};

console.log('------------------------------------------');

var commandHandler = function (command, input) {
	console.log(command, input);
	switch (command) {
		case 'my-tweets':
			return myTweets(input);
		case 'spotify-this-song':
			return spotifyThisSong(input);
		case 'movie-this':
			return movieThis(input);
		case 'do-what-it-says':
			return doWhatItSays();
		default:
			return console.log(
				'The available commands are: \n * my-tweets [tweet count]\n * spotify-this-song [song name] \n * movie-this [movie name] \n * do-what-it-says'
			);
	}
};

commandHandler(process.argv[2], process.argv.splice(3).join(' '));
