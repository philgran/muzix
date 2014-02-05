var http = require('http');

var options = {
	host: 'ws.spotify.com',
	path: '/search/1/track.json?q=jai+paul'
};

var callback = function(response) {
	var str = '';
	response.on('data', function(chunk){
		str += chunk;
	});

	response.on('end', function(){
		console.log(str);
	});
};

http.request(options, callback).end();