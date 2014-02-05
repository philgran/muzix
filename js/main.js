(function(scope){
	var $ = document.querySelectorAll;

	function _init() {
		SC.initialize({
			client_id: 'f10d28a5f721c5c7355db5c599b5209a'
		});

		$('input.query').addEventListener('keyup', function(e){
			if (e.keyCode === '13' && this.value !== '') {
				_search(this.value);
				return;
			}
		});
	}

	function _search(query) {
		SC.get('/tracks', { q: query }, function(tracks) {
			console.log(tracks);
		});
	}

	_init();

})(window);