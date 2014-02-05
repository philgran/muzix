define([
	'./soundcloud'
], function(
	SC
){

	return function Soundcloud() {
		function _init() {
			SC.initialize({
				client_id: 'f10d28a5f721c5c7355db5c599b5209a'
			});
		}

		function _search(query) {
			SC.get('/tracks', { q: query }, function(tracks) {
				console.log(tracks);
			});
		}
console.log(SC);
		this.search = _search;

		_init();
	}

});