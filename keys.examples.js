var twitterKeys = {
  consumer_key: 'KeyGoesHere',
  consumer_secret: 'KeyGoesHere',
  access_token_key: 'KeyGoesHere',
  access_token_secret: 'KeyGoesHere',
}

var keyArray = Object.keys(twitterKeys);
for (var i = 0; i < keyArray.length; i++) {
	process.env[keyArray[i].toUpperCase()] = twitterKeys[keyArray[i]];
}