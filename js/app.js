requirejs.config({
	'baseUrl': 'js/lib',
	'paths': {
		'app': '../app',
		'soundcloud': '//connect.soundcloud.com/sdk',
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
	}
});

requirejs(['app/main']);