"use strict";
var request = require('request');
var fs = require('fs');
var spotify = require('spotify');
var Twitter = require('twitter');
var keys = require('./keys.js');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var requestHelper = function (URL, callback) {
	request(URL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body));
		} else throw error;
	});
};

var writeCommandToFile = function (fileName, entry) {
	fs.appendFile(fileName, entry, function (error) {
		if (error) throw error;
	});
}

var concatenateStrings = function(array, data) {
	var outputText = '';
	for (var i = 0; i < array.length; i++) {
		var textPath = data[array[i].path]
		//Have to hand code nested paths because I didn't want to use eval() :/
		if (array[i].label == 'Artists') textPath = data.artists[0].name;
		else if (array[i].label == 'Album') textPath = data.album.name;
		outputText += (array[i].label + ': ' + textPath + '\n'); 
	}
	return outputText;
};

var myTweets = function(input) {
	var tweetCount = input ? input : 20;
	client.get(
		'statuses/user_timeline',
		{
			count: tweetCount,
			screen_name: 'M_H_Rogers',
			trim_user: true,
			exclude_replies: false,
			include_rts: true,
		},
		function (error, data, response) {
			if (error) console.log(error);
			else {
				for (var i = 0; i < data.length; i++) {
					console.log(
						data[i].text + '\n' + 'Date tweeted: ' +
						data[i].created_at + '\n'
					);
				}
			}
		}
	);
};

var spotifyThisSong = function(input) {
	var searchTerm = input ? input : 'The Sign Ace of Base';
	var outputKeys = [
		{label: 'Song name', path: 'name'},
		{label: 'Artists', path: 'artists[0].name'},
		{label: 'Album', path: 'album.name'},
		{label: 'Preview Link', path: 'preview_url'},
	];
	spotify.search({
		type: 'track',
		query: searchTerm,
	}, function (error, data) {
		if (error) throw error;
		else {
			console.log(
				concatenateStrings(outputKeys, data.tracks.items[0])
			);
		}
	});
};

var movieThis = function(input) {
	var outputKeys = [
		{label: 'Title', path: 'Title'},
		{label: 'Year', path: 'Year'},
		{label: 'imdbRating', path: 'imdbRating'},
		{label: 'Country', path: 'Country'},
		{label: 'Language', path: 'Language'},
		{label: 'Plot', path: 'Plot'},
		{label: 'Actors', path: 'Actors'},
		{label: 'tomatoRating', path: 'tomatoRating'},
		{label: 'tomatoURL', path: 'tomatoURL'},
	];
	var searchTerm = input ? input : 'Mr. Nobody';

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
		else { //Pass the split array as parameters to commandHandler
			commandHandler.apply(this, data.trim().split(','));
		} 
	});
};

var commandHandler = function (command, input) {
	writeCommandToFile('log.txt', command + ',"' + input + '"'+'\n');
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
				'The available commands are: \n' + 
				'* my-tweets [tweet count]\n' + 
				'* spotify-this-song [song name] \n' + 
				'* movie-this [movie name] \n' +
				'* do-what-it-says'
			);
	}
};

console.log('------------------------------------------');
commandHandler(process.argv[2], process.argv.splice(3).join(' '));
