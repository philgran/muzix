(function(scope){

	var Soundcloud = function() {
		function _init() {
			SC.initialize({
				client_id: 'f10d28a5f721c5c7355db5c599b5209a'
			});
		}

		function _getResults(query) {
			var promise = new Promise(function(resolve, reject){
				SC.get('/tracks', { q: query }, function(tracks) {
					resolve(tracks || null);
				});
			});
			return promise;
		}

		function _renderResults(results) {
			return results.map(function(track){
				return '<li><h4>'+unescape(track.title)+'</h4><h6>Downloaded: '+track.download_count+'</h6><h6>Favorited: '+track.favoritings_count+'</h6></li>';
			}).join('');
		}

		this.getResults = _getResults;
		this.renderResults = _renderResults;

		_init();
	};

	var Spotify = function() {
		var _request = new XMLHttpRequest();

		function _getResults(query) {
			var promise = new Promise(function(resolve, reject){
				var url = 'http://ws.spotify.com/search/1/track.json?q='+query;
				_request.open('GET', url, true);
				_request.onload = function() {
					var data = JSON.parse(_request.responseText) || null;
					resolve(data);
				};
				_request.onerror = function(obj) {
					reject(obj);
				};
				_request.send();
			});
			return promise;
		}

		function _renderResults(results) {
			var html = _.template(
				'<li>'+
					'<h4><%= a %></h4>'+
					'<h6><%= t %></h6>'+
					'<h6>Popularity: <%= p %></h6>'+
				'</li>');
			var tracks = results.tracks;
			var output = tracks.map(function(track){
				var popularity = track.popularity;
				var artists = track.artists.map(function(artist){
					return artist.name;
				});
				if (popularity < 0.1) { return null; }
				return html({
					a: artists.join(", "),
					t: track.name,
					p: popularity
				});
			});

			return _.compact(output).join('');
		}

		this.getResults = _getResults;
		this.renderResults = _renderResults;
	};

	var LastFM = function() {
		var _request = new XMLHttpRequest();

		function _getResults(query) {
			var promise = new Promise(function(resolve, reject){
				var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+query+'&api_key=0d0c017a1e01dfd2284a60c5ccbf565a&format=json';
				
				_request.open('GET', url, true);
				_request.onload = function(obj) {
					var data = JSON.parse(_request.responseText) || null;
					resolve(data);
				};
				_request.onerror = function(obj) {
					reject(obj);
				};
				_request.send();
			});
			return promise;
		}

		function _renderResults(results) {
			// Array of artists
			var artists = results.results.artistmatches.artist;
			return artists.map(function(artist){
				return '<li><h4>'+artist.name+'</h4><h6>Listeners: '+artist.listeners+'</h6></li>';
			}).join('');
		}

		this.getResults = _getResults;
		this.renderResults = _renderResults;
	};

	var Bandcamp = function() {

	};

	// MODULES ABOVE HERE

	var oSoundcloud = new Soundcloud();
	var oSpotify = new Spotify();
	var oLastFM = new LastFM();

	function _init() {
		_bindEvents();
	}

	function _bindEvents() {
		document.querySelector('input.query').addEventListener('keyup', function(e){
			if (e.keyCode === 13 && this.value !== '') {
				_search(this.value);
				return;
			}
		});
	}

	function _renderResults(results) {
		document.querySelector('.soundcloud-list').innerHTML = oSoundcloud.renderResults(results.soundcloud);
		document.querySelector('.spotify-list').innerHTML = oSpotify.renderResults(results.spotify);
		document.querySelector('.lastfm-list').innerHTML = oLastFM.renderResults(results.lastfm);
	}

	function _search(q) {
		var query = escape(q);
		var promises = [
			oSoundcloud.getResults(query),
			oSpotify.getResults(query), 
			oLastFM.getResults(query)
		];

		Promise.all(promises).then(function(result){
			console.log(result);
			_renderResults({
				soundcloud: result[0],
				spotify: result[1],
				lastfm: result[2]
			});
			return {
				soundcloud: result[0],
				spotify: result[1],
				lastfm: result[2]
			};
		});
	}

	_init();

})(window);